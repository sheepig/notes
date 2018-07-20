> 参考：JavaScript高级程序设计（第三版）

## 原型链

借用MDN的一张图：

![prototype](https://wx4.sinaimg.cn/large/7ed42f5cly1fqguw4y1zej20ge0e8wes.jpg)

当谈到继承时，JavaScript 只有一种结构：对象。每个实例对象（`object`）都有一个私有属性（称之为`__proto__`）指向它的原型对象（`prototype`）。该原型对象也有一个自己的原型对象 ，层层向上直到一个对象的原型对象为 `null`。根据定义，`null` 没有原型，并作为这个原型链中的最后一个环节。

几乎所有 JavaScript 中的对象都是位于原型链顶端的`Object`的实例。

## 原型模式

不必在构造函数中定义对象实例的信息，而是可以将这些信息直接添加到原型对象中，如下面的例子所示。

```javascript
function Person(){
}
Person.prototype.name = "Nicholas";
Person.prototype.age = 29;
Person.prototype.job = "Software Engineer";
Person.prototype.sayName = function(){
    alert(this.name);
};
var person1 = new Person();
person1.sayName();   //"Nicholas"
var person2 = new Person();
person2.sayName(); //"Nicholas"
alert(person1.sayName == person2.sayName);  //true
```

对象实例添加属性时，会屏蔽原型对象中保存的同名属性。

```javascript
function Person(){
}
Person.prototype.name = "Nicholas";
Person.prototype.age = 29;
Person.prototype.job = "Software Engineer";
Person.prototype.sayName = function(){
    alert(this.name);
};
var person1 = new Person();
var person2 = new Person();
person1.name = "Greg";
alert(person1.name); // "Greg"——来自实例 
alert(person2.name); // "Nicholas"——来自原型
```

使用 `delete` 操作符则可以完全删除实例属性，从而让我们能够重新访问原型中的属性。

```javascript
delete person1.name;
alert(person1.name); // "Nicholas"——来自原型
```

### 一些类型检测方法

#### isPrototypeOf() -- 判断实例和原型之间的关系

```javascript
alert(Person.prototype.isPrototypeOf(person1));  //true
```

#### Object.getPrototypeOf()(ES5) -- 判断实例和原型之间的关系

```javascript
alert(Object.getPrototypeOf(person1) == Person.prototype); //true
```

#### hasOwnProperty() -- 检测一个属性是存在于实例中，还是存在于原型中

这个方法(不要忘了它是从 `Object` 继承来的)只在给定属性存在于对象实例中时，才会返回 `true`。

```javascript
function Person(){
}
Person.prototype.name = "Nicholas";
Person.prototype.age = 29;
Person.prototype.job = "Software Engineer";
Person.prototype.sayName = function(){
    alert(this.name);
}
var person1 = new Person();
alert(person1.hasOwnProperty("name"));  //false
person1.name = "Greg";
alert(person1.name); //"Greg"——来自实例
alert(person1.hasOwnProperty("name")); //true
```

#### in -- 在通过对象能够访问给定属性时返回 true，无论该属性存在于实例中还是原型中。

```javascript
function Person(){
}
Person.prototype.name = "Nicholas";
Person.prototype.age = 29;
Person.prototype.job = "Software Engineer";
Person.prototype.sayName = function(){
    alert(this.name);
};
var person1 = new Person();
var person2 = new Person();
alert(person1.hasOwnProperty("name"));  //false
alert("name" in person1);  //true
person1.name = "Greg";
alert(person1.name); //"Greg" ——来自实例 
alert(person1.hasOwnProperty("name")); //true 
alert("name" in person1); //true
```

### for..in 和 Object.keys()

在使用 `for-in` 循环时，返回的是所有能够通过对象访问的、可枚举的(`enumerated`)属性，其中既包括存在于实例中的属性，也包括存在于原型中的属性。

要取得对象上所有可枚举的实例属性，可以使用`Object.keys()`方法。

### 重写原型

前面例子中每添加一个属性和方法就要敲一遍 `Person.prototype`。为减少不必要的输入，也为了从视觉上更好地封装原型的功能，更常见的做法是用一个包含所有属性和方法的对象字面量来重写整个原型对象，如下面的例子所示。

```javascript
function Person(){
}
Person.prototype = {
    name : "Nicholas",
    age : 29,
    job: "Software Engineer",
    sayName : function () {
        alert(this.name);
    }
};
```

这里使用的语法，本质上完全重写了默认的 `prototype` 对象，因此 `constructor` 属性也就变成了新对象的 `constructor` 属性(指向 `Object` 构造函数)，不再指向 `Person` 函数。

让原型对象的 `constructor` 指向构造函数:

```javascript
Object.defineProperty(Person.prototype, "constructor", {
    enumerable: false,
    value: Person
});
```

### 原型对象的问题

属性共享问题：在实例中修改原型对象的属性，会同步修改到其他实例上。

```javascript
function Person(){
}
Person.prototype = {
    constructor: Person,
    name : "Nicholas",
    age : 29,
    job : "Software Engineer",
    friends : ["Shelby", "Court"],
    sayName : function () {
        alert(this.name);
} };
var person1 = new Person();
var person2 = new Person();
person1.friends.push("Van");
alert(person1.friends);    //"Shelby,Court,Van"
alert(person2.friends);    //"Shelby,Court,Van"
alert(person1.friends === person2.friends);  //true
```
