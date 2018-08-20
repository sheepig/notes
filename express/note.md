## express source code analysis

通常用 `var app = express()` 新建一个服务，实际上是调用了下面这个方法：

```javascript
function createApplication() {
  var app = function(req, res, next) {
    app.handle(req, res, next);
  };

  mixin(app, EventEmitter.prototype, false);
  mixin(app, proto, false);

  // expose the prototype that will get set on requests
  app.request = Object.create(req, {
    app: { configurable: true, enumerable: true, writable: true, value: app }
  })

  // expose the prototype that will get set on responses
  app.response = Object.create(res, {
    app: { configurable: true, enumerable: true, writable: true, value: app }
  })

  app.init();
  return app;
}
```

这里两次 [mixin](https://github.com/component/merge-descriptors/blob/master/index.js) ，把 `EventEmiter` 类的原型对象上和 `proto` 的可枚举属性描述符（property descriptors）混合到 app 上。`EventEmitter` 类由 `events` 模块定义和开放，`proto` 引自文件 `application.js` 。混入的方式是“不重定义”，即出现相同属性描述符的时候，app 的不会被其他的两个覆盖。

两次 `Object.create` 把对请求和相应数据流的操作方法，挂在 app 原型上。其实 res 继承了 `http.ServerResponse.prototype` ，req 继承了 `http.IncomingMessage.prototype` 。

`app.init()` 初始化每个 express 实例（以下用 app 代称）。

```javascript
app.init = function init() {
  this.cache = {};
  this.engines = {};
  this.settings = {};

  this.defaultConfiguration();
};
```

每个 app ，都维护自己特有的一份配置。初始化配置（调用 app 的 set 方法）之后，app 的 setting 如下：

```javascript
{
    'x-powered-by': true,
    etag: 'weak',
    'etag fn': [Function: generateETag],
    env: 'development',
    'query parser': 'extended',
    'query parser fn': [Function: parseExtendedQueryString],
    'subdomain offset': 2,
    'trust proxy': false,
    'trust proxy fn': [Function: trustNone],
    view: [Function: View],
    views: 'E:\\learning\\notes\\views',
    'jsonp callback name': 'callback' 
}
```

最后会监听 app 的 `mount` 事件。这个事件在 app.use 的最后 `emit` 。

### Router && layer

Router 构造函数接收三个参数，每次创建一个 Router 实例，都会对这个路由进行处理。

```javascript
function router(req, res, next) {
    router.handle(req, res, next);
}
```






