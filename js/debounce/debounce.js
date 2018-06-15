/**
 * 最简单版本
 * @param {function} method  [去抖的函数]
 * @param {number}   wait    [延时时间，ms]
 * @param {object}   context [执行的作用域，若无给出，则为全局作用域]
 */
function debounce (method, wait, context) {
    clearTimeout(method.tId);
    method.tId = setTimeout(function(){
        method.call(context);
    }, wait);
}

/**
 * @param  {function} method  [去抖的函数]
 * @param  {number}   wait    [延时时间，ms]
 * @return {function}         []
 */
function debounce(method, wait) {
    var timer = null;
    return function() {
        var context = this;
        var args = arguments;
        // 清空上一次定时器
        clearTimeout(timer);
        timer = setTimeout(function(){
            method.call(context, args);
        }, wait);
    }
}