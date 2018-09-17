### VNode

Virtual DOM 其实就是一棵以 JavaScript 对象（VNode 节点）作为基础的树，用对象属性来描述节点，实际上它只是一层对真实 DOM 的抽象。关键角色 VNode 是在什么时候创建的，每个 vm 最终都会拥有自己的 Virtual DOM 子树吗？

#### VNode 类

VNode 的构造函数很简单，根据入参初始化实例的属性，以及初始化不依赖参数的属性。没有对原型对象做修改。

```javascript
var VNode = function VNode (
  tag,               /* 标签名 */
  data,              /* 数据信息，比如 data ，$attr */
  children,          /* 子节点，数组 */
  text,              /* 节点的文本 */
  elm,               /* 虚拟节点对应的真实 dom 节点*/
  context,           /* component VNode 的上一级父组件 */
  componentOptions,  /* component VNode 自身的属性，包括构造函数，propsData，listeners，tag，children*/
  asyncFactory       /* 渲染异步组件的工厂函数 */
) {
    // ...
}
```

VNode 大致可以分为以下几类：

 - 空VNode（注释节点）

```javascript
var createEmptyVNode = function (text) {
  if ( text === void 0 ) text = '';

  var node = new VNode();
  node.text = text;
  node.isComment = true;
  return node
};
```

注意到 node 的 `isComment` 被标记为 `true` 。diff 的时有优化。

 - 文本节点

```javascript
function createTextVNode (val) {
  return new VNode(undefined, undefined, undefined, String(val))
}
```

文本节点可以说是数量最多的 VNode 了。像 `<p>hello</p>` `<li>{{item.value}}</li>` 里面的文字，最终会成为一个文本节点。文本节点也是 Virtual DOM 树枝的末端。它的后面不会有子节点了。

 - 克隆节点

静态节点和 solt 节点可能在不同 render 中使用，通过克隆这些节点可以避免 DOM 更改时，涉及的 DOM 节点出错。

 - 组件节点

这类节点可以是常见的 `Vue.component('component-a', options)` 方式创建的节点，也可以是[异步组件](https://cn.vuejs.org/v2/guide/components-dynamic-async.html#%E5%9C%A8%E5%8A%A8%E6%80%81%E7%BB%84%E4%BB%B6%E4%B8%8A%E4%BD%BF%E7%94%A8-keep-alive)。

#### render function

把 Virtual DOM 映射到真实 DOM，依赖的是一个 render function，beforeMount 之前，初始化这个 render function

```javascript
if (!vm.$options.render) {
    vm.$options.render = createEmptyVNode;
}
```

#### VNode 的创建

在对 vm `initRender` 的时候，做了这样一步：

```javascript
vm._vnode = null; // the root of the child tree
```

`vm.$mount` 的时候，会调用 `vm._render()` (Vue.prototype 上的方法，实际上调用的是 vm.$options.render ) ，从 `vm.$options` 提取 vnode 信息，初始化 parentVnode ，同时生成更新组件 VNode 节点。

```javascript
var vm = this;
var ref = vm.$options;
var render = ref.render;

// set parent vnode. this allows render functions to have access
// to the data on the placeholder node.
vm.$vnode = _parentVnode;

vnode = render.call(vm._renderProxy, vm.$createElement); // returns
```

#### diff & patch

此时我们得到一个新的 VNode，需要和旧的 VNode 对比更新。通过 `vm._update` 实现。


Virtual DOM 具有跨平台，Vue 对 API（插入，删除节点，新建节点等...） 做了一些封装，提供统一的接口。

---

diff 算法

关于 diff 的思想可以看 [React diff](https://calendar.perfplanet.com/2013/diff/) 。最关键的一点就是：比较只会在同级进行。

![](https://calendar.perfplanet.com/wp-content/uploads/2013/12/vjeux/1.png)









