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

/** 定时器方法
 * @param   {function} method [节流的方法]
 * @param   {number}   delay  [间隔执行时间]
 * @returns {function}        []
 */
function throttle(method, delay) {
    var timer = null;
    return function() {
        var context = this;
        var args = arguments;
        if (!timer) {
            timer = setTimeout(function() {
                method.apply(this, args);
                timer = null;
            }, delay);
        }
    }
}