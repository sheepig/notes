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

------

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

`then` 可能在同个 promise 上多次调用

 - 如果/当 promise 转换为 fulfilled ，所有对应的 `onFulfilled` 回调会按照 `then` 发起的顺序调用。
 - 如果/当 promise 转换为 rejected ，所有对应的 `onRejected` 回调会按照 `then` 发起的顺序调用。

`then` 必须返回一个 promise

```javascript
promise2 = promise1.then(onFulfilled, onRejected);
```

 - `onFulfilled` 或 `onRejected` 之一返回一个 value ，则执行 Promise Resolution Procedure `[[Resolve]](promise2, x)` 
 - `onFulfilled` 或 `onRejected` 之一抛出一个异常 `e` ，`promise2` 必须被 rejected ，并且将  `e` 作为 reason 传入
 - 如果 `onFulfilled` 不是一个函数而且 `promise1` 转换为 fulfilled ，`promise2` 必须转换为 fulfilled ，并且将 `promise1` 的 value 传入。
 - 如果 `onRejected` 不是一个函数而且 `promise1` 转换为 rejected ，`promise2` 必须转换为 rejected ，并且将 `promise1` 的 reason 传入。

------

##### Promise Resolution Procedure

**Promise Resolution Procedure** 是一个抽象的操作，输入是一个 promise 和一个 value ， 我们用 `[[Resolve]](promise, x)` 表示，如果 `x` 是 thenable 的，它做此尝试：在 `x` 表现得像一个 promise 的前提下，让  `promise` 采用 `x` 的状态( `state` )。否则将 `promise` 的状态转换为 fulfilled ，`x` 作为 value 。

执行 `[[Resolve]](promise, x)` ，会执行以下步骤：

如果 `promise` 和 `x` 指向同个对象，以一个 `TypeError` 为 reason ，拒绝这个 `promise` 。

1. 如果 `x` 是一个 promise ，采用它的 state

 - 如果 `x` 处于 pending 中，`promise` 必须保持 pending 直至 `x` 转换为 fulfilled 或 rejected 
 - 如果/当 `x` 转换为 fulfilled ，以相同的 value ，履行这个 `promise` （fulfill `promise` with the same value）
 - 如果/当 `x` 转换为 rejected ，以相同的 reason ，拒绝这个 `promise` （reject `promise` with the same reason）


2. 如果 x 是一个对象或者函数

 - 令 `then` = `x.then`
 - 如果访问 `x.then` 会抛出一个异常 `e` ，以 `e` 为 reason 拒绝这个 promise 
 - 如果 then 是一个函数，将它的 `this` 绑定为 `x` 并调用它，第一个参数是 `resolvePromise` ，第二个参数是 `rejectedPromise` 。

```javascript
then.call(x, resolvePromise, rejectedPromise)
```
如果 `resolvePromise` 调用，调用返回值是 `y` ，执行 `[[Resolve]](promise, y)`

如果 `rejectedPromise` 调用，调用返回值是 `r` ，以 `r` 为由拒绝 `promise` 

如果 `resolvePromise` `rejectedPromise` 都被调用，或者以相同参数多次调用，则只采用第一次调用，忽略其他调用

如果调用 then 抛出一个异常 e ：

如果 `resolvePromise` `rejectedPromise` 都已经被调用，忽略 e 

否则，以 `e` 为 reason 拒绝这个 `promise` 

 - 如果 `then` 不是一个函数，以 `x` 履行这个 `promise` （fulfill promise with x）

3. 如果 x 既不是函数也不是对象，以 `x` 履行这个 `promise` （fulfill promise with x）

### 实现 Promise

Promise 应该是一个构造函数

```javascript
```
































>参考
[从一道Promise执行顺序的题目看Promise实现](https://fed.renren.com/2018/03/10/promise/)
[InterviewMap-Promise 实现](https://yuchengkai.cn/docs/zh/frontend/#promise-%E5%AE%9E%E7%8E%B0)
[Promises/A+](https://promisesaplus.com/)