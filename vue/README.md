## info
Vue Version: `2.3.3` 。

用来调试打 console.log 的文件是 `dist/vue.js` 。默认开发环境，直接在 html 文档中 用 script 引入这个文件。

源码引自 `dist/vue.esm.js` 。

为了方便书写，行文中用 vm 指代 Vue 实例。

## new Vue(options)

每一 Vue 实例，都是通过 Vue 构造函数创建的。

```javascript
function Vue (options) {
  if (process.env.NODE_ENV !== 'production' &&
    !(this instanceof Vue)
  ) {
    warn('Vue is a constructor and should be called with the `new` keyword');
  }
  this._init(options);
}
```

定义这个构造函数后，对 Vue 还做了以下这些：

```javascript
initMixin(Vue);
stateMixin(Vue);
eventsMixin(Vue);
lifecycleMixin(Vue);
renderMixin(Vue);
```

字面意义上理解，这里对以后通过 `new Vue()` 创建成的 vm ，初始化一系列属性、方法、生命周期，最后挂载。

### initMixin(Vue)

在这个方法中，定义了 Vue 原型对象上的方法 `_init` 。

大致把 _init 的过程拆分如下：

 - merge options
 - initProxy
 - initLifecycle
 - initEvents
 - initRender
 - callHook(vm, 'beforeCreated')
 - initInjections(vm)
 - initState(vm)
 - initProvide(vm)
 - callHook(vm, 'created')
 - vm.$mount

#### merge options

尝试一个最简单的例子：

```javascript
var App = '<div><p>hello</p></div>';

new Vue({
    el: '#app',
    template: App
});
```

这一步的最终目的，是把 merged options 挂在 vm 的属性 `$options` ：

![merged options](./static/mergedOptions.png)

但是入参 options 只提供了 el，template 这两个属性，其他属性是怎么来的呢？

答案是 mergeOptions(parent, child, vm) 。沿着 vm 的原型链查找到的最顶级祖先对象（本质是一个构造函数），一路更新每层节点的 options 。并且收集这些 options ，构成合成的 options 的一个来源：parent 。 child，也就是入参 options ，解析 child 的 props、inject、directives 为规定的对象格式；如果 child 有 extends、mixins，还要把这些选项 merge 进 parent。

主要关心一个 merge 的策略。这里用 defaultStrat ：

```javascript
var defaultStrat = function (parentVal, childVal) {
  return childVal === undefined
    ? parentVal
    : childVal
};
```

实际上做的是先把 perent 的 key-value 放到一个空对象（最终返回的对象），再把 child 中 key 的值不存在于刚刚那个对象的 key-value 值放进去。所以如果有同名属性，parent 的会覆盖 child 中的。

#### initProxy

开发环境下会执行这一步。

[Proxy](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Proxy) 定义：Proxy 对象用于定义基本操作的自定义行为（如属性查找，赋值，枚举，函数调用等）。

```javascript
var handlers = options.render && options.render._withStripped
    ? getHandler
    : hasHandler;
vm._renderProxy = new Proxy(vm, handlers);
```

其中 getHandler 和 hasHandler 定义了访问 vm 的属性时候的自定义行为。 hasHandler 对给定的属性，如果 vm 有这个属性，且该属性不是一些全局都能访问的方法或类（undefined、parseInt、Date、Array...具体查看 allowedGlobals ），也不是 Vue 对象内部自有属性（`_` 开头，比如 `_isVue` `_self` ...）则返回 true ，否则返回 false 。getHandler 定义 访问 vm 的属性时候的自定义行为。返回对应的属性的值。

这里的 Proxy 就行一道安检，在开发环境时访问 vm 的任何属性的时候，对访问不到的属性打出 warning ，方便开发时候 debug 。













