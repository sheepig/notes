> 参考：JavaScript高级程序设计（第三版）

## 原型链继承

核心思想：子类的原型是父类的实例

```javascript
function SuperType(){
    this.property = true;
}
SuperType.prototype.getSuperValue = function(){
    return this.property;
};
function SubType(){
    this.subproperty = false;
}
//继承了 SuperType
SubType.prototype = new SuperType();

SubType.prototype.getSubValue = function (){
    return this.subproperty;
}

var instance = new SubType();
alert(instance.getSuperValue());
//true
```

在上面的代码中，我们没有使用 `SubType` 默认提供的原型，而是给它换了一个新原型;这个新原型就是 `SuperType` 的实例。于是，新原型不仅具有作为一个 `SuperType` 的实例所拥有的全部属性和方法， 而且其内部还有一个指针，指向了 `SuperType` 的原型。最终结果就是这样的: `instance` 指向 `SubType` 的原型， `SubType` 的原型又指向 `SuperType` 的原型。 `getSuperValue()`方法仍然还在 `SuperType.prototype` 中，但 `property` 则位于 `SubType.prototype` 中。这是因为 `property` 是一 个实例属性，而 `getSuperValue()`则是一个原型方法。既然 `SubType.prototype` 现在是 `SuperType` 的实例，那么 `property` 当然就位于该实例中了。此外，要注意 `instance.constructor` 现在指向的 是 `SuperType`，这是因为原来 `SubType.prototype` 中的 `constructor` 被重写了的缘故。
> 实际上，不是 `SubType` 的原型的 `constructor` 属性被重写了，而是 `SubType` 的原型指向了另一个对象—— `SuperType` 的原型，而这个原型对象的 `constructor` 属性指向的是 `SuperType`。

### 原型和实例的关系

 - `instanceof` 只要用 这个操作符来测试实例与原型链中出现过的构造函数，结果就会返回 `true`。
 - `isPrototypeOf()` 只要是原型链中出现过的原型，都可以说是该 原型链所派生的实例的原型，因此 `isPrototypeOf()`方法也会返回 `true`

### 注意

即在通过原型链实现继承时，不能使用对象字面量创建原型方法。因为这样做就会重写原型链。

### 原型链的问题

在通过原型来实现继承时，原型实际上会变成另一个类型的实例。于是，原先的实例属性也就顺理成章地变成了现在的原型属性了。

在创建子类型的实例时，不能向超类型的构造函数中传递参数。实际上，应该说是没有办法在不影响所有对象实例的情况下，给超类型的构造函数传递参数。