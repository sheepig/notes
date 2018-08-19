// var App = 
//     `<div>
//         <child></child>
//         <component-a></component-a>
//     </div>`;

// var componentA = Vue.component('component-a', {
//     template: '<div>{{name}}</div>',
//     data: function() {
//         return {
//             name: 'component-A'
//         }
//     }
// });

// var Child = Vue.component('child', {
//     template: '<div><span>{{name}}</span><span>{{desc}}</span><button @click="change">change name</button></div>',
//     data: function () {
//         return {
// 		    name: 'yang',
//             desc: 'child'
//         }
//     },
//     methods: {
//         change() {
//             this.name = "woo";
//         }
//     }
// });


// new Vue({
//     el: '#app',
//     template: App,
//     data: function(){
//         return {
//         }
//     },
//     components: {
//         Child,
//         componentA
//     }
// });


let a = {
    value: 1
}
function getValue(name, age) {
    console.log(name)
    console.log(age)
    console.log(this.value)
}

Function.prototype.myCall = function(context) {
    let context = context || window;
    context.fn = this;
    let args = [...arguments].slice(1);
    let result = context.fn(args);
    delete context.fn;
    return result;
}

// getValue.call(a, 'ogg', 52);


Function.prototype.myApply = function(context) {
    var context = context || window;
    context.fn = this;
    let args = [...arguments].slice(1);
    let result;
    if (arguments[1]) {
        result = context.fn(...arguments[1])
      } else {
        result = context.fn()
      }

    delete context.fn;
    return result;
}

// getValue.myApply(a, ['ogg', '7']);

Function.prototype.myBind = function(context) {
    var context = context || window;
    var fn = this;
    let args = [...arguments].slice(1);
    if (args[1]) {
        return function() {
            fn.call(context, ...args);
        }
    } else {
        return function() {
            fn.call(context);
        }
    }
}

// getValue.myBind(a, 'ogg', '34')();

// var script = document.createElement('script');
// script.text = "console.log('from script');"
// console.log('before script');
// document.body.appendChild(script);
// console.log('after script');


// var f = function(first) {
//     let sum = first * first;
//     let multi = function(param) {
//         sum += param * param;
//         multi.value = sum;
//         return multi;
//     }
//     multi.value = sum;
//     multi.valueOf = function() {
//         return this.value;
//     }
//     return multi;
// }

// var gg = 9;
// var gg = f(1)(2);
// console.log(gg)

function add(n) {
    var args = [].slice.call(arguments); // 闭包存储args
    console.log('===== args =====');
    console.log(args);
    
    var fn = function() {
        var fn_args = [].slice.call(arguments); // 合并参数
        console.log('===== fn_args =====');
        console.log(fn_args);
        return add.apply(null, args.concat(fn_args));
    }

    fn.valueOf = function() {
        console.log('fn valueOf called');
        return args.reduce((a, b) =>  a + b );
    }
    return fn;
}

// function add(n) {
//     var sum = n;
//     var multi = function(param) {
//         sum += param;
//         multi.value = sum;
//         return multi;
//     }
//     multi.value = sum;
//     multi.valueOf = function() {
//         return this.value;
//     } 
//     return multi;
// }


var n = add(1)(2)(3);
console.log(n)


























