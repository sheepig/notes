## 批量异步更新策略

Vue.js 在默认情况下，每次触发某个数据的 setter 方法后，对应的 Watcher 对象其实会被 push 进一个队列 queue 中，在下一个 tick 的时候将这个队列 queue 全部拿出来 run（ Watcher 对象的一个方法，用来触发 patch 操作） 一遍。

callbacks 队列存放异步回调

```javascript
/* globals MessageChannel */

var callbacks = [];
var pending = false;
```

nextTick 把一个异步操作压入 callbacks 数组。每次 tick ，其实是把一个我们希望的异步回调放到 callbacks 队列中，同时查看：如果当期没有更新操作，清空 callbacks 队列（宏任务，微任务两种模式）。 开始操作清空 callbacks 时 pending 会被置回 false，所以有可能出现这种情况：上一次 tick 清空 callbacks 还在执行，有有一个新的清空需求被压入执行栈。

```javascript
function nextTick (cb, ctx) {
  var _resolve;
  callbacks.push(function () {
    if (cb) {
      try {
        cb.call(ctx);
      } catch (e) {
        handleError(e, ctx, 'nextTick');
      }
    } else if (_resolve) {
      _resolve(ctx);
    }
  });
  if (!pending) {
    pending = true;
    if (useMacroTask) {
      macroTimerFunc();
    } else {
      microTimerFunc();
    }
  }
  // $flow-disable-line
  if (!cb && typeof Promise !== 'undefined') {
    return new Promise(function (resolve) {
      _resolve = resolve;
    })
  }
}
```

清空 callbacks 其实是下面这个方法

```javascript
function flushCallbacks () {
  pending = false;
  var copies = callbacks.slice(0);
  callbacks.length = 0;
  for (var i = 0; i < copies.length; i++) {
    copies[i]();
  }
}
```

两种任务模式：宏任务，微任务。

其实这两种模式，都是以一种异步方式，执行 flushCallbacks 。区别在于“速度”。

 - 宏任务：按以下方式降级处理

1. setImmediate
2. MessageChannel
3. setTimeout(0)

 - 微任务

1. Promise.resolve().then(flushCallbacks)
2. 不支持微任务，降级为宏任务

### Vue.prototype.$nextTick && Vue.nextTick

这两个方法基本一样，只是 [vm.$nextTick](https://cn.vuejs.org/v2/api/#vm-nextTick) 会绑定当前的 this（vm实例）。

官网对 vm.$nextTick 的描述：将回调延迟到下次 DOM 更新循环之后执行。在修改数据之后立即使用它，然后等待 DOM 更新。

```javascript
Vue.prototype.$nextTick = function (fn) {
    return nextTick(fn, this)
};
```

$nextTick 的使用可以看：[简单理解Vue中的nextTick](https://juejin.im/post/5a6fdb846fb9a01cc0268618)



