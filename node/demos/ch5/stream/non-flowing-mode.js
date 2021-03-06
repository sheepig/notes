
const Readable = require('stream').Readable;

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
// myReadable.on('readable', () => {
//     let chunk;
//     while (null !== (chunk = myReadable.read())) {
//         console.log(`received ${chunk.length} bytes of data`);
//     }
// });
let once = false;
myReadable.on('readable', (chunk) => {
    console.log(myReadable._readableState.buffer.length);
    if (once) {
        return
    }
    once = true;
    console.log(myReadable.read());
})
module.exports = {};