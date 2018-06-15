## throttle
函数节流（throttle）：当持续触发事件时，保证一定时间段内只调用一次事件处理函数。节流通俗解释就比如我们水龙头放水，阀门一打开，水哗哗的往下流，秉着勤俭节约的优良传统美德，我们要把水龙头关小点，最好是如我们心意按照一定规律在某个时间间隔内一滴一滴的往下滴。
### 时间戳方法
```javascript
/**
 * 时间戳方法
 * @param   {function} method [节流的方法]
 * @param   {number}   delay  [间隔执行时间]
 * @returns {function}        []
 */
function throttle(method, delay) {
    var prev = Date.now();
    return function() {
        var context = this;
        var args = arguments;
        var now = Date.now();
        if (now - prev > delay) {
            method.apply(context, args);
            prev = Date.now();
        }
    }
}
```
看一下用法
```javascript

```