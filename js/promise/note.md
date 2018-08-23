## Promise

### Promise/A+ 

以下内容译自 Promise/A+ 规范。

Promise 代表一个异步操作的最终结果。操作一个 promise 的主要方式是通过它的 `then` 方法，该方法接收一个回调，回调参数是 promise 的最终值或这个 promise 转为 fulfilled 失败的原因。

#### 术语

 - “promies” 是一个对象或函数，并有一个符合规范的 `then` 方法
 - “thenable” 是一个定义 `then` 方法的对象或函数
 - “value” 是任何合法的 JavaScript 值（包括 `undefined` ，一个 thenable ，或一个 promise）
 - “exception” 是用 `throw` 声明抛出的值
 - “reason” 指明一个 promise 为什么被 rejected 。

#### 条件

##### Promise 的状态

一个 promise 只能处于三种状态中的一种：`pending`, `fulfilled` 或 `rejected` 。

当 promise 处于 pending 时：

 - 可能转换为 fulfilled、 rejected 之一

当 promise 处于 fulfilled 时：

 - 不可转换为其他状态
 - 必须有一不可更改的 value

当 promise 处于 rejected 时：

 - 不可转换为其他状态
 - 必须有一个不可更改的 reason

这里所说的“不可更改”，指的是自身不变性（比如 `===` ），但不需要遵循深层不可变性。

##### `then` 方法

promise 必须提供一个 `then` 方法，用以访问当前的/最终的 value 或 reason 。

`then` 方法接收两个参数：

```javascript
promise.then(onFulfilled, OnRejected)
```

`onFulfilled` 和 `onRejected` 都是可选参数

 - 如果 `onFulfilled` 不是函数，忽略
 - 如果 `onRejected` 不是函数，忽略

如果 `onFulfulled` 是函数

 - 它必须在 `promise` 转换为 fulfilled 之后调用，第一个参数是 `promise` 的 value
 - 不可以在 `promise` 转换为 fulfilled 之前调用
 - 不可以被调用一次以上

如果 `onRejected` 是函数

 - 它必须在 `promise` 转换为 rejected 之后调用，第一个参数是 `promise` 的 reason
 - 不可以在 `promise` 转换为 rejected 之前调用
 - 不可以被调用一次以上

当且仅的[执行上下文](https://es5.github.io/#x10.3)栈只包含[平台代码](https://promisesaplus.com/#notes) `onFulfilled` 和 `onRejected` 被调用

`onFulfilled` 和 `onRejected` 必须以函数的形式调用（不能有 `this` ，严格模式下 `this` 为 `undefined` ，非严格模式下 `this` 指向 `global` 对象）。




































>参考
[从一道Promise执行顺序的题目看Promise实现](https://fed.renren.com/2018/03/10/promise/)
[InterviewMap-Promise 实现](https://yuchengkai.cn/docs/zh/frontend/#promise-%E5%AE%9E%E7%8E%B0)
[Promises/A+](https://promisesaplus.com/)