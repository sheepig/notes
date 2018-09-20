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

其实在这之前还有一个 template compile 的过程。

#### diff & patch

此时我们得到一个新的 VNode，需要和旧的 VNode 对比更新。通过 `vm._update` 实现。


Virtual DOM 具有跨平台，Vue 对 API（插入，删除节点，新建节点等...） 做了一些封装，提供统一的接口。

---

diff 算法

关于 diff 的思想可以看 [React diff](https://calendar.perfplanet.com/2013/diff/) 。最关键的一点就是：比较只会在同级进行。

![](https://calendar.perfplanet.com/wp-content/uploads/2013/12/vjeux/1.png)

简化后的 patch 函数如下，oldVNode 是旧的 VNode 节点，vnode 是新的 VNode 节点，parentElm 是真实的 DOM 节点，是 oldVnode.el ，即 oldVnode 对应的父节点。

```javascript
function patch(oldVNode, vnode, parentElm) {
  if (!vnode) {
    // 如果新节点不存在，删去旧节点
    invokeDestroyHook(oldVnode);
    return;
  }

  var isInitialPatch = false;
  var insertedVnodeQueue = [];
  if (!oldVnode) {
    // 如果旧节点不存在，直接向 parentElm 添加新节点
    isInitialPatch = true;
    createElm(vnode, insertedVnodeQueue, parentElm);
  } else {
    if (sameVNode(oldVnode, vnode)) {
      // 如果 oldVnode 和 vnode 是相同节点类型，执行 patchVnode
      patchVnode(oldVnode, vnode, insertedVnodeQueue);
    } else {
      // 删除旧节点，添加新节点
      removeVnodes(parentElm, oldVnode, oldVnode.length - 1);
      addVnodes(parentElm, null, vnode, vnode.length - 1);
    }
  }
}
```

什么是“相同节点类型”，判断条件如下：a，b 的 key 值必须一样，然后满足以下任一条件： 

1. type 相同的 input 元素
2. asyncFactory 相同的异步组件

```javascript
function sameVnode(a, b) {
  return (
    a.key === b.key && (
      (
        a.tag === b.tag &&
        a.isComment === b.isComment &&
        isDef(a.data) === isDef(b.data) &&
        sameInputType(a, b)
      ) || (
        isTrue(a.isAsyncPlaceholder) &&
        a.asyncFactory === b.asyncFactory &&
        isUndef(b.asyncFactory.error)
      )
    )
  )
}
```

patchVnode

```javascript
function patchVnode(oldVnode, vnode, insertedVnodeQueue) {
  if (oldVnode === vnode) {
    return
  }

  //在当新老 VNode 节点都是 isStatic（静态的），并且 key 相同时，只要将 componentInstance 与 elm 从老 VNode 节点“拿过来”即可。
  // 这里的 isStatic 是「编译」的时候会将静态节点标记出来，这样就可以跳过比对的过程。

  if (vnode.isStatic && oldVnode.isStatic && vnode.key === oldVnode.key) {
    vnode.elm = oldVnode.elm;
    vnode.componentInstance = oldVnode.componentInstance;
    return;
  }

  var elm = vnode.elm = oldVnode.elm;
  var oldCh = oldVnode.children;
  var ch = vnode.children;

  // 如果新节点是文本节点，直接设置 elm 的节点值
  if (vnode.text) {
    nodeOps.setTextContent(elm, vnode.text);
  } else {
    // 更新子节点
    if (oldCh && ch && (oldCh !== ch)) {
      updateChildren(elm, oldCh, ch);
    } else if (ch) {
      if (oldVnode.text) nodeOps.setTextContent(elm, '');
      addVnodes(elm, null, ch, 0, ch.length - 1);
    } else if (oldCh) {
      removeVnodes(elm, oldCh, 0, oldCh.length - 1)
    } else if (oldVnode.text) {
      nodeOps.setTextContent(elm, '')
    }
  }
}
```
当新 VNode 节点是非文本节点当时候，需要分几种情况。

 - oldCh 与 ch 都存在且不想同时，使用 updateChildren 函数来更新子节点，具体过程可以看[这篇文章](https://cloud.tencent.com/developer/article/1006029)。

 - 如果只有 ch 存在的时候，如果老节点是文本节点则先将节点的文本清除，然后将 ch 批量插入插入到节点elm下。

 - 同理当只有 oldch 存在时，说明需要将老节点通过 removeVnodes 全部清除。

 - 最后一种情况是当只有老节点是文本节点的时候，清除其节点文本内容。



> 参考
> 
> 染陌的掘金小册：剖析 Vue.js 内部运行机制









