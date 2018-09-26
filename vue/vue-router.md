### 路由注册

使用路由之前，需要先让 Vue 可以使用 VueRouter ，调用 `Vue.use(VueRouter)` 。Vue.use 会去找到插件的 install 函数，安装插件。

VueRouter 的安装做了以下工作：

 - 安装 VueRouter 并确保只安装一次
 - 在 Vue 对象上混入 beforeCreated、destroyed 钩子。
 - 全局注册 router-view、router-link 组件

```javascript
function install (Vue) {
  if (install.installed && _Vue === Vue) { return }
  install.installed = true;

  // 把 Vue 赋值给全局变量
  _Vue = Vue;

  var isDef = function (v) { return v !== undefined; };

  var registerInstance = function (vm, callVal) {
    var i = vm.$options._parentVnode;
    if (isDef(i) && isDef(i = i.data) && isDef(i = i.registerRouteInstance)) {
      i(vm, callVal);
    }
  };

  Vue.mixin({
  	// 给每个组件混入 beforeCreated 钩子，用以初始化路由
    beforeCreate: function beforeCreate () {
      // SPA 应用中，我们会把 new VueRouter(...) 创建的路由对象传入根组件的构造函数 所以只有根组件有 router 对象
      if (isDef(this.$options.router)) {
      	// 对于根组件，把它的根路由设置为自己
        this._routerRoot = this;
        this._router = this.$options.router;

        // 初始化路由
        this._router.init(this);

        // 实现 _route 属性双向绑定，_route 改变时触发组件渲染
        Vue.util.defineReactive(this, '_route', this._router.history.current);
      } else {
      	// 不是根组件，则从它的父组件获取根路由，设置自己的根路由
        this._routerRoot = (this.$parent && this.$parent._routerRoot) || this;
      }
      registerInstance(this, this);
    },
    destroyed: function destroyed () {
      registerInstance(this);
    }
  });

  // 代理，组件内可以通过 this.$router 访问 this._routerRoot._router，下同理
  Object.defineProperty(Vue.prototype, '$router', {
    get: function get () { return this._routerRoot._router }
  });

  Object.defineProperty(Vue.prototype, '$route', {
    get: function get () { return this._routerRoot._route }
  });

  // 全局注册组件 router-view router-link
  Vue.component('router-view', View);
  Vue.component('router-link', Link);

  var strats = Vue.config.optionMergeStrategies;
  // use the same hook merging strategy for route hooks
  strats.beforeRouteEnter = strats.beforeRouteLeave = strats.beforeRouteUpdate = strats.created;
}
```

### 创建 VueRouter 实例

我们用 `new VueRouter(options)` 创建路由实例，并作为参数传递给根组件。

```javascript
const Home = { template: '<div>home</div>' }
const Foo = { template: '<div>foo</div>' }
const Bar = { template: '<div>bar</div>' }

const router = new VueRouter({
  mode: 'hash',
  routes: [
    { path: '/', component: Home }, 
    { path: '/foo', component: Foo },
    { path: '/bar', component: Bar }
  ]
})

Vue.use(VueRouter)

var app = new Vue({
	el: '#app',
	router,
})
```

接下来看 VueRouter 构造函数：

```javascript
var VueRouter = function VueRouter (options) {
  if ( options === void 0 ) options = {};

  this.app = null;
  this.apps = [];
  this.options = options;
  this.beforeHooks = [];
  this.resolveHooks = [];
  this.afterHooks = [];

  // 创建路由匹配对象
  this.matcher = createMatcher(options.routes || [], this);

  // 根据 mode 采用不同的路由模式，缺省为 hash 模式
  var mode = options.mode || 'hash';
  this.fallback = mode === 'history' && !supportsPushState && options.fallback !== false;
  if (this.fallback) {
    mode = 'hash';
  }
  if (!inBrowser) {
    mode = 'abstract';
  }
  this.mode = mode;

  // 根据不同的路由模式 创建路由
  switch (mode) {
    case 'history':
      this.history = new HTML5History(this, options.base);
      break
    case 'hash':
      this.history = new HashHistory(this, options.base, this.fallback);
      break
    case 'abstract':
      this.history = new AbstractHistory(this, options.base);
      break
    default:
      if (process.env.NODE_ENV !== 'production') {
        assert(false, ("invalid mode: " + mode));
      }
  }
};
```

#### 创建路由匹配对象

```javascript
function createMatcher (
  routes,
  router
) {
  // 创建路由映射表
  var ref = createRouteMap(routes);
  var pathList = ref.pathList;
  var pathMap = ref.pathMap;
  var nameMap = ref.nameMap;

  function addRoutes (routes) {
    createRouteMap(routes, pathList, pathMap, nameMap);
  }

  function match (
    raw,
    currentRoute,
    redirectedFrom
  ) { ... }

  function redirect (
    record,
    location
  ) { ... }

  function alias (
    record,
    location,
    matchAs
  ) { ... }

  function _createRoute (
    record,
    location,
    redirectedFrom
  ) {
    if (record && record.redirect) {
      return redirect(record, redirectedFrom || location)
    }
    if (record && record.matchAs) {
      return alias(record, location, record.matchAs)
    }
    return createRoute(record, location, redirectedFrom, router)
  }

  return {
    match: match,
    addRoutes: addRoutes
  }
}
```

createMatcher 先创建路由映射表，上面例子的路由路径表是这样的：

![path map](./static/pathMap.png)

通过闭包的方式，match 函数和 addRoutes 函数可以访问到路由映射表相关信息。这两个函数又有返回值，最终返回一个 Matcher 对象。

最初的路由映射表是基于 VueRouter 实例的 routes 属性生成的。过程就是遍历 routes 的每一项，添加路由记录。添加路由记录的过程就不详细讲了，大致是拿着已有的路由记录，包括 pathList （像 `["", "/foo", "/bar"]` ），pathMap （如上图所示），nameMap （像 `{ foo: {path: "/foo", regex: /^\/foo(?:\/(?=$))?$/i, components: {…}, instances: {…}, name: "foo", …}
home: {path: "", regex: /^(?:\/(?=$))?$/i, components: {…}, instances: {…}, name: "home", …}}` ）,前一个是数组，后两个是对象。如果是第一次添加路由记录，无非就是这几个属性都为空而已。

我们会在 pathMap 和 nameMap 里面添加新的路由记录，像上面的正则匹配对象就是在这个过程加进去的，更多的还有 meta 属性，beforeEnter 等。然后也会处理 children ，递归为 children 添加路由记录；给别名（alias）添加路由记录。

```javascript
function createRouteMap (
  routes,
  oldPathList,
  oldPathMap,
  oldNameMap
) {
  // the path list is used to control path matching priority
  var pathList = oldPathList || [];
  // $flow-disable-line
  var pathMap = oldPathMap || Object.create(null);
  // $flow-disable-line
  var nameMap = oldNameMap || Object.create(null);

  routes.forEach(function (route) {
    addRouteRecord(pathList, pathMap, nameMap, route);
  });

  // ensure wildcard routes are always at the end
  for (var i = 0, l = pathList.length; i < l; i++) {
    if (pathList[i] === '*') {
      pathList.push(pathList.splice(i, 1)[0]);
      l--;
      i--;
    }
  }

  return {
    pathList: pathList,
    pathMap: pathMap,
    nameMap: nameMap
  }
}
```

### 路由初始化

前面的路由安装 `Vue.use(VueRouter)` 有一步路由初始化，发生在 Vue 的 beforeCreated 生命钩子中。

```javascript
VueRouter.prototype.init = function init (app /* Vue component instance */) {
  var this$1 = this;

  process.env.NODE_ENV !== 'production' && assert(
    install.installed,
    "not installed. Make sure to call `Vue.use(VueRouter)` " +
    "before creating root instance."
  );

  // 保存组件实例
  this.apps.push(app);

  // main app already initialized.
  // 如果根组件已经有了就返回
  if (this.app) {
    return
  }

  this.app = app;

  var history = this.history;
  // 根据路由模式 添加监听
  // 路由跳转
  if (history instanceof HTML5History) {
    history.transitionTo(history.getCurrentLocation());
  } else if (history instanceof HashHistory) {
    var setupHashListener = function () {
      history.setupListeners();
    };
    history.transitionTo(
      history.getCurrentLocation(),
      setupHashListener,
      setupHashListener
    );
  }

  // 触发组件渲染
  history.listen(function (route) {
    this$1.apps.forEach(function (app) {
      app._route = route;
    });
  });
};
```

### 路由模式原理

客户端的路由模式有两种：history 模式和 hash 模式。

参考 interviewMap 的两张图：

![hash mode](https://user-gold-cdn.xitu.io/2018/7/11/164888109d57995f?w=942&h=493&f=png&s=39581)

![history mode](https://user-gold-cdn.xitu.io/2018/7/11/164888478584a217?w=1244&h=585&f=png&s=59637)

#### window.history

window.history 表示 window 对象的历史记录，是由用户主动产生，并且接受 javascript 脚本控制的全局对象。window 对象通过 history 对象提供对览器历史记录的访问能力。它暴露了一些非常有用的方法和属性，让你在历史记录中自由前进和后退。

```javascript
window.history.go(-2);    //后退两次
window.history.go(2);     //前进两次
window.history.back();    //后退
window.hsitory.forward(); //前进
```

HTML5 的新 API 扩展了 window.history ，使历史记录点更加开放了。可以存储当前历史记录点、替换当前历史记录点、监听历史记录点。更多查看 [MDN history api](https://developer.mozilla.org/zh-CN/docs/Web/API/History_API)

#### hash 模式

hash 模式背后的原理是 onhashchange 事件,可以在 window 对象上监听这个事件：

```javascript
window.onhashchange = function(event){
     console.log(event.oldURL, event.newURL);
     // ...
}
```
hash 模式下的 url ，改变 `#` 后面的内容并不会向服务器发送请求。

hash 发生变化的 url 都会被浏览器记录下来，浏览器的前进后退都可以用了。这样一来，尽管浏览器没有请求服务器，但是页面状态和url一一关联起来

#### history 模式

监听历史记录点，直观的可认为是监听 URL 的变化，但会忽略 URL 的 hash 部分。可以通过 window.onpopstate 来监听 url 的变化，并且可以获取存储在该历史记录点的状态对象。

history 修改 url 中的 path ，当输入 url 或点击浏览器刷新按钮的时候，是会请求服务器的，但是网络上可能没有这个网络资源。

pushState 和 replaceState 这两个方法有个共同的特点：当调用他们修改浏览器历史记录栈后，虽然当前 URL 改变了，但浏览器不会立即发送请求该 URL（the browser won't attempt to load this URL after a call to pushState()），这就为单页应用前端路由“更新视图但不重新请求页面”提供了基础。

对于单页应用来讲，理想的使用场景是仅在进入应用时加载 index.html ，后续在的网络操作通过 Ajax 完成，不会根据 URL 重新请求页面，但是难免遇到特殊情况，比如用户直接在地址栏中输入并回车，浏览器重启重新加载应用等。

hash模式仅改变hash部分的内容，而hash部分是不会包含在HTTP请求中的：

```
http://oursite.com/#/user/id   // 如重新请求只会发送http://oursite.com/
```

故在hash模式下遇到根据URL请求页面的情况不会有问题。

而history模式则会将URL修改得就和正常请求后端的URL一样

```
http://oursite.com/user/id
```

在此情况下重新向后端发送请求，如后端没有配置对应/user/id的路由处理，则会返回404错误。官方推荐的解决办法是在服务端增加一个覆盖所有情况的候选资源：如果 URL 匹配不到任何静态资源，则应该返回同一个 index.html 页面，这个页面就是你 app 依赖的页面。同时这么做以后，服务器就不再返回 404 错误页面，因为对于所有路径都会返回 index.html 文件。为了避免这种情况，在 Vue 应用里面覆盖所有的路由情况，然后在给出一个 404 页面。或者，如果是用 Node.js 作后台，可以使用服务端的路由来匹配 URL，当没有匹配到路由的时候返回 404，从而实现 fallback。

#### 路由实现

VueRouter 无论是哪种路由模式，都是继承自 History 类：

```javascript
var History = function History (router, base) {
  this.router = router;
  this.base = normalizeBase(base);
  // start with a route object that stands for "nowhere"
  this.current = START;
  this.pending = null;
  this.ready = false;
  this.readyCbs = [];
  this.readyErrorCbs = [];
  this.errorCbs = [];
};
```






































