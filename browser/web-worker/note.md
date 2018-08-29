## 浅谈 Web Worker

[Web Worker](https://developer.mozilla.org/zh-CN/docs/Web/API/Web_Workers_API) 使得一个 Web 应用程序可以在与主执行线程分离的后台线程中运行一个脚本操作。这样做的好处是可以在一个单独的线程中执行费时的处理任务，从而允许主（通常是UI）线程运行而不被阻塞/放慢。

### 创建 worker

```javascript
var myWorker = new Worker('task.js');

myWorker.onmessage = function(e) {
    console.log('in mainr:', e.data)
}
myWorker.postMessage({
    msg: 'from main'
})
```

脚本 task.js 在 worker 线程运行。

```javascript
var i = 0;

function timer(wait) {
    setTimeout(() => {
        console.log('in worker:', i);
        postMessage(i);
    }, wait);
}

timer(4000);

onmessage = function(e) {
    console.log(e.data)
}
```

在 task.js 中，global 是一个 [DedicatedWorkerGlobalScope](https://developer.mozilla.org/zh-CN/docs/Web/API/DedicatedWorkerGlobalScope) 对象，setTimeout 时和最外部的 this 指向这个对象，所以这里没有指定调用 possMessage ，onmessage 的对象（其实就是 this.postMessage）。




> 参考
> 
> [浅谈HTML5 Web Worker](https://juejin.im/post/59c1b3645188250ea1502e46)
> 
> 