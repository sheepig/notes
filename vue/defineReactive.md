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

