一个 vm ，什么属性会被 defineReactive ？

| obj | key&value|
|-----|----------|
| vm._props | * |
| vm | vm.$options.inject |
| vm | vm.$attr |
| vm | vm.$listener |
| vm._data | * |

```javascript
function defineReactive (
  obj,
  key,
  val,
  customSetter,
  shallow
) {
  var dep = new Dep();

  var property = Object.getOwnPropertyDescriptor(obj, key);
  if (property && property.configurable === false) {
    return
  }

  // cater for pre-defined getter/setters
  var getter = property && property.get;
  if (!getter && arguments.length === 2) {
    val = obj[key];
  }
  var setter = property && property.set;
  
  var childOb = !shallow && observe(val);
  Object.defineProperty(obj, key, {
    enumerable: true,
    configurable: true,
    get: function reactiveGetter () {
      var value = getter ? getter.call(obj) : val;
      if (Dep.target) {
        dep.depend();
        if (childOb) {
          childOb.dep.depend();
          if (Array.isArray(value)) {
            dependArray(value);
          }
        }
      }
      return value
    },
    set: function reactiveSetter (newVal) {
      var value = getter ? getter.call(obj) : val;
      /* eslint-disable no-self-compare */
      if (newVal === value || (newVal !== newVal && value !== value)) {
        return
      }
      /* eslint-enable no-self-compare */
      if (process.env.NODE_ENV !== 'production' && customSetter) {
        customSetter();
      }
      if (setter) {
        setter.call(obj, newVal);
      } else {
        val = newVal;
      }
      childOb = !shallow && observe(newVal);
      dep.notify();
    }
  });
}
```

一个 vm ，创建的 Dep 对象（订阅者）的数量，最基本就有 `vm.$attr` `vm.$listener` 带来的两个。data 的数据响应式是“深层次”的，也就是无论 data 对象嵌套多深，每一个嵌套的 key 都有一个 Dep 实例订阅。

defineReactive 支持自定义的 getter/setter 。

### Dep

![Dep](./static/Dep.png)

每一个 Dep 实例都维护一个 subs 数组，存放 Watcher 实例。

### Observer

![Observer](./static/Observer.png)

与之相关主要是一个 observe 方法。该方法对一个字面量对象或者对象数组“深度observe”。具体例子如下

```javascript
{
    name: 'yang',
    city: 'Beijing',
    friends: [{
        name: 'Lizi',
        city: 'unknow'
    }, {
        name: 'Judy',
        city: 'sg'
    }],
    contact: {
        phone: '1234566654',
        wechat: 'xv221',
        qq: '1123342',
        emai: {
            qq: '2323@qq.com',
            netease: '235r@163.com'
        }
    }
}
```

![observer-order](./static/observer-order.png)

最外层对象，认为是一个根对象，调用 observe 时候如果标记了 asRootData ，每次 observe 都会刷新 vmCount 的值。总的来看，observe 的顺序是自上而下，从里到外的。

在 initProps-validateProp 对 props 对象中每一个对象 observe ，不标记 asRootData 。
在 initData 对 data (`vm._data`) observe ，标记 asRootData 。
在 defineReactive 对 val（参数，对象 key——val）observe ，不标记 asRootData 。实际上是对 inject/provide 的 observe 。

可以看到 Observer 原型对象上有两个方法：`observeArray` `walk` 。`walk` 其实就是深度遍历 observe 的对象，对每一个属性 defineReactive 。如果遇到数组则依次 observe 每一项。









