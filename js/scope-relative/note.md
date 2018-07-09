## 作用域、闭包相关问题集锦

### IIFE

[MDN IIFE（ 立即调用函数表达式）](https://developer.mozilla.org/zh-CN/docs/Glossary/%E7%AB%8B%E5%8D%B3%E6%89%A7%E8%A1%8C%E5%87%BD%E6%95%B0%E8%A1%A8%E8%BE%BE%E5%BC%8F)

判断以下执行结果：

```javascript
var env = 'outer';
(function(){
    console.log(env);
    var env = 'inner';
})();
```

```javascript
var env = 'outer';
(function(){
    var env = 'inner';
    console.log(env); // inner
})();
```

### 扩展 console.log 方法

扩展 console.log 方法，每个输出前增加一个自增序号。

```javascript
function myLog (fn) {
    id = 0;
    return function() {
        id++;
        var fn_args = [].slice.call(arguments);
        fn_args.unshift(id+':');
        fn.apply(null, fn_args);
    }
}

console.log = myLog(console.log);

var num = 2;
console.log('foo');       // 1: foo
console.log('bar');       // 2: bar
console.log('num:', num); // 3: num: 2
```

### 函数柯里化

实现一个函数，输出结果如下：

```javascript
f(1).value==1;
f(1)(2).value==5;
f(1)(2)(3).value==14;
```

```javascript
var f = function(first) {
    let sum = first * first;
    let multi = function(param) {
        sum += param * param;
        multi.value = sum;
        return multi;
    }
    multi.value = sum;
    return multi;
}
```
