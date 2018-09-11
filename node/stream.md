> 参考
> [深入理解 Node.js Stream 内部机制](http://taobaofed.org/blog/2017/08/31/nodejs-stream/)
> [Node.js 中流操作实践](https://juejin.im/post/5b950c4ae51d450e7f52c634)

## Stream 模块

Stream 是 Node.js 中的基础概念，类似于 EventEmitter，专注于 IO 管道中事件驱动的数据处理方式；类比于数组或者映射，Stream 也是数据的集合，只不过其代表了不一定正在内存中的数据。。Node.js 的 Stream 分为以下类型（都是继承自 Stream）：

Readable Stream: 可读流，数据的产生者，譬如 process.stdin
Writable Stream: 可写流，数据的消费者，譬如 process.stdout 或者 process.stderr
Duplex Stream: 双向流，即可读也可写
Transform Stream: 转化流，数据的转化者

node 为 Stream 定义了一套接口规范。灰色部分（pause，resume等）node 已实现了接口，但是自定义的 readable stream 需要实现接口 `_read()`，writable stream 需要实现 `_write()` `_writev()` 。

![stream api](https://user-gold-cdn.xitu.io/2018/9/9/165be37ec9a7b42d?imageView2/0/w/1280/h/960/format/webp/ignore-error/1)

### Readable Stream

Readable Stream 由两种模式，Flowing Mode ，在 Stream 上绑定 ondata 事件，就会触发这个模式。另外一种模式是 Non-Flowing Mode，没流动，也就是暂停模式，这是 Stream 的预设模式，在 Stream 上绑定 onreadable 事件就会进入这个模式。流动模式下，支持 onreadable 事件触发一次（once）。

```javascript
// set up data events if they are asked for
// Ensure readable listeners eventually get something
Readable.prototype.on = function(ev, fn) {
  const res = Stream.prototype.on.call(this, ev, fn);
  const state = this._readableState;

  if (ev === 'data') {
    // update readableListening so that resume() may be a no-op
    // a few lines down. This is needed to support once('readable').
    state.readableListening = this.listenerCount('readable') > 0;

    // Try start flowing on next tick if stream isn't explicitly paused
    if (state.flowing !== false)
      this.resume();
  } else if (ev === 'readable') {
    if (!state.endEmitted && !state.readableListening) {
      state.readableListening = state.needReadable = true;
      state.flowing = false;
      state.emittedReadable = false;
      debug('on readable', state.length, state.reading);
      if (state.length) {
        emitReadable(this);
      } else if (!state.reading) {
        process.nextTick(nReadingNextTick, this);
      }
    }
  }

  return res;
};
```

`_readableState.flowing` 标志位在 Readable Stream 实例，它有三种取值。

```javascript
_readableState.flowing === null;  // 暂时没有消费者过来
_readableState.flowing === false; // 触发 pause 事件
_readableState.flowing === true;  // Flowing Mode
```

流动模式模型如下：

![flowing mode](https://gw.alicdn.com/tfs/TB1rJvJaMMPMeJjy1XbXXcwxVXa-742-413.png)

看一个简单的例子

```javascript
const Readable = require('stream').Readable;

var counter = 0;
// Stream 实现
class MyReadable extends Readable {
  constructor(dataSource, options) {
    super(options);
    this.dataSource = dataSource;
  }
  // 继承了 Readable 的类必须实现这个函数
  // 触发系统底层对流的读取
  _read() {
    const data = this.dataSource.makeData();
    if (counter === 5) {
        this.pause();
    }
    this.push(data);
  }
}

// 模拟资源池
const dataSource = {
  data: new Array(10).fill('-'),
  // 每次读取时 pop 一个数据
  makeData() {
    if (!dataSource.data.length) return null;
    return dataSource.data.pop();
  }
};

const myReadable = new MyReadable(dataSource);
myReadable.setEncoding('utf8');
myReadable.on('data', (chunk) => {
  console.log(++counter, chunk);
});
```

_read 方法中把产生的数据压入缓存池（注意要调用这个方法，该方法是 Readable Stream 的 prototype 实现的），push 数据的时候，会调用一个 readableAddChunk 方法，该方法把 data 放入缓存池。此时才有数据流动。

资源的数据流并不是直接流向消费者，而是先 push 到缓存池，缓存池有一个水位标记 highWatermark，超过这个标记阈值，push 的时候会返回 false ，什么场景下会出现这种情况呢？

 - Readable Stream 主动执行了 .pause()
 - 消费速度比数据 push 到缓存池的生产速度慢

这种情况也叫【背压】，Writable Stream 也存在类似的情况。达到最高水位之后，不会再往缓存池压入数据。

Readable Stream 还包括如下常用的方法：

 - Readable.pause(): 这个方法会暂停流的流动。换句话说就是它不会再触发 data 事件。
 - Readable.resume(): 这个方法和上面的相反，会让暂停流恢复流动。
 - Readable.unpipe(): 这个方法会把目的地移除。如果有参数传入，它会让可读流停止流向某个特定的目的地，否则，它会移除所有目的地。

---

非流动模式

监听 readable 的回调函数第一个参数不会传递内容，需要我们通过 myReadable.read() 主动读取。

![non flowing mode](https://gw.alicdn.com/tfs/TB1JzPFaMoQMeJjy1XaXXcSsFXa-713-418.png)

资源池会不断地往缓存池输送数据，直到 highWaterMark 阈值，消费者监听了 readable 事件并不会消费数据，需要主动调用 .read([size]) 函数才会从缓存池取出，并且可以带上 size 参数，用多少就取多少：

```javascript
const myReadable = new MyReadable(dataSource);
myReadable.setEncoding('utf8');
myReadable.on('readable', () => {
  let chunk;
  while (null !== (chunk = myReadable.read())) {
    console.log(`Received ${chunk.length} bytes of data.`);
  }
});
```

### Writable Stream

原理与 Readable Stream 是比较相似的，数据流过来的时候，会直接写入到资源池，当写入速度比较缓慢或者写入暂停时，数据流会进入队列池缓存起来，如下图所示：

当生产者写入速度过快，把队列池装满了之后，就会出现「背压」，这个时候是需要告诉生产者暂停生产的，当队列释放之后，Writable Stream 会给生产者发送一个 drain 消息，让它恢复生产。

![writable stream](https://gw.alicdn.com/tfs/TB17EDKaMMPMeJjy1XcXXXpppXa-726-407.png)

同样的，自定义的 Writable Stream 类需要实现 `_write` 接口，可以在 new 一个 writeable 类的时候，把 write 函数传进去。也可以直接定义 `_write` 函数。

```javascript
const Writable = require('stream').Writable;

class MyWritable extends Writable {
  constructor(options) {
    super(options);
  }
  _write(chunk, encoding, cb) {
    setTimeout(() => {
      cb && cb();
    })
  }
}

const writer = new MyWritable();
```

尝试写入 10000 条数据，在写入的时候做了一些处理，让写入速度没那么快。

```javascript
function writeOneMillionTimes(writer, data, encoding, callback) {
  let i = 10000;
  write();
  function write() {
    let ok = true;
    while(i-- > 0 && ok) {
      // 写入结束时回调
      ok = writer.write(data, encoding, i === 0 ? callback : null);
    }
    if (i > 0) {
      // 这里提前停下了，'drain' 事件触发后才可以继续写入  
      console.log('drain', i);
      writer.once('drain', write);
    }
  }
}

writeOneMillionTimes(writer, 'simple', 'utf8', () => {
  console.log('end');
});
```

执行结果
```javascript
drain 7268
drain 4536
drain 1804
end
```

说明程序遇到了三次「背压」，如果我们没有在上面绑定 writer.once('drain')，那么最后的结果就是 Stream 将第一次获取的数据消耗完变结束了程序。

在源码中可以看到，当队列池超过最高水位 highWaterMark ，将 needDrain 标志位置为 true 。

```javascript
var ret = state.length < state.highWaterMark;
// we must ensure that previous needDrain will not be reset to false.
if (!ret)
state.needDrain = true;
```

在向队列池写入数据的时候，会根据是否异步的选项，同步或异步地调用 afterWrite 方法。

```javascript
if (sync) {
  process.nextTick(afterWrite, stream, state, finished, cb);
} else {
  afterWrite(stream, state, finished, cb);
}
```

来看看 afterWrite 具体做了什么。

```javascript
function afterWrite(stream, state, finished, cb) {
  if (!finished)
    onwriteDrain(stream, state);
  state.pendingcb--;
  cb();
  finishMaybe(stream, state);
}

// Must force callback to be called on nextTick, so that we don't
// emit 'drain' before the write() consumer gets the 'false' return
// value, and has a chance to attach a 'drain' listener.
function onwriteDrain(stream, state) {
  if (state.length === 0 && state.needDrain) {
    state.needDrain = false;
    stream.emit('drain');
  }
}
```

Writable Stream 的 finish 事件未触发前，会调用 onwriteDrain ，结果就是触发 drain 事件。

finish 事件是 Writable Stream 的 end() 调用触发的。

### pipe

pipe 其实就像一个管道，链接一个 Readable Stream 和一个 Writable Stream 。

```javascript
Readable.prototype.pipe = function(dest, pipeOpts) {
  // 简略实现
  var src = this;
  dest.on('unpipe', onunpipe);
  // when the dest drains, it reduces the awaitDrain counter
  // on the source.  This would be more elegant with a .once()
  // handler in flow(), but adding and removing repeatedly is
  // too slow.
  // Writable Stream 会注册 drain 事件，虽然更好的是用 .once ，但是反复注册和移除事件的开销过大
  dest.on('drain', (src) => {
    while (src.flowing && src.read() !== null);
  });

  src.on('data', (chunk) => {
    var ret = dest.write(chunk);
    if (ret === false) {
      // 背压，暂停
      src.pause();
    }
  });

  // tell the dest that it's being piped to
  dest.emit('pipe', src);
  // start the flow if it hasn't been started already.
  if (!state.flowing) {
    debug('pipe resume');
    src.resume();
  }
  // 支持链式调用
  return dest;
}
```

pipe 会自动启动背压机制
![pipe](https://user-gold-cdn.xitu.io/2018/9/9/165be37e6465b93e?imageView2/0/w/1280/h/960/format/webp/ignore-error/1)

当 Node.js 的流机制监测到 write 函数返回了 false，背压系统会自动介入；其会暂停当前 Readable Stream 的数据传递操作，直到消费者准备完毕。

```javascript
+===============+
|   Your_Data   |
+=======+=======+
        |
+-------v-----------+          +-------------------+         +=================+
|  Readable Stream  |          |  Writable Stream  +--------->  .write(chunk)  |
+-------+-----------+          +---------^---------+         +=======+=========+
        |                                |                           |
        |     +======================+   |        +------------------v---------+
        +----->  .pipe(destination)  >---+        |    Is this chunk too big?  |
              +==^=======^========^==+            |    Is the queue busy?      |
                 ^       ^        ^               +----------+-------------+---+
                 |       |        |                          |             |
                 |       |        |  > if (!chunk)           |             |
                 ^       |        |      emit .end();        |             |
                 ^       ^        |  > else                  |             |
                 |       ^        |      emit .write();  +---v---+     +---v---+
                 |       |        ^----^-----------------<  No   |     |  Yes  |
                 ^       |                               +-------+     +---v---+
                 ^       |                                                 |
                 |       ^   emit .pause();        +=================+     |
                 |       ^---^---------------------+  return false;  <-----+---+
                 |                                 +=================+         |
                 |                                                             |
                 ^   when queue is empty   +============+                      |
                 ^---^-----------------^---<  Buffering |                      |
                     |                     |============|                      |
                     +> emit .drain();     |  <Buffer>  |                      |
                     +> emit .resume();    +------------+                      |
                                           |  <Buffer>  |                      |
                                           +------------+  add chunk to queue  |
                                           |            <--^-------------------<
                                           +============+
```

### Duplex Stream

双工流的输入流和输出流可以没有任何关系

![duplex](https://gw.alicdn.com/tfs/TB188THaMoQMeJjy0FpXXcTxpXa-793-625.png)

Duplex 继承自 Readable 和 Writable ，可以通过 options 配置为半双工流，全双工流

```javascript
if (options) {
    if (options.readable === false)
      this.readable = false;

    if (options.writable === false)
      this.writable = false;

    if (options.allowHalfOpen === false) {
      this.allowHalfOpen = false;
      this.once('end', onend);
    }
  }
}
```

### Transform Stream

Transform Stream 集成了 Duplex Stream，它同样具备 Readable 和 Writable 的能力，只不过它的输入和输出是存在相互关联的，中间做了一次转换处理。常见的处理有 Gzip 压缩、解压等。

![transform](https://gw.alicdn.com/tfs/TB19pTCaMMPMeJjy1XdXXasrXXa-825-401.png)

Transform Stream 继承自 Duplex ，本质是将 Duplex 的 Readable 链接到 Writable 。由于 Readable 的生产效率与 Writable 的消费效率是一样的，所以这里 Transform 内部不存在「背压」问题，背压问题的源头是外部的生产者和消费者速度差造成的。

### PassThrough Stream

PassThrough 继承自 Transform ，在开发中我们也经常需要直接将某个可读流输出到可写流中，此时也可以在其中引入 PassThrough，以方便进行额外地监听：

```javascript
const { PassThrough } = require('stream');
const fs = require('fs');

const duplexStream = new PassThrough();

// can be piped from reaable stream
fs.createReadStream('tmp.md').pipe(duplexStream);

// can pipe to writable stream
duplexStream.pipe(process.stdout);

// 监听数据，这里直接输出的是 Buffer<Buffer 60 60  ... >
duplexStream.on('data', console.log);
```