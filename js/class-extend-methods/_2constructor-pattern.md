> 参考：JavaScript高级程序设计（第三版）

## 构造函数模式
```javascript
function Person(name, age, job) {
    this.name = name;
    this.age = age;
    this.job = job;
    this.sayName = function() {
        console.log(this.name);
    };
}
var person1 = new Person('Jack', 32, 'Doctor');
var person2 = new Person('Marry', 22, 'Teacher');
```
这个例子中，`Person()`函数取代了`createPerson()`函数，`Person()`函数中没有显示地创建对象，直接将属性和方法赋给`this`，没有`return`语句。

创建`Person`的新实例，必须使用`new`操作符。这种方式会经历以下四个过程：

 - 创建一个新对象
 - 将构造函数的作用域赋给新对象（`this`指向这个新对象）
 - 执行构造函数中的代码
 - 返回新对象

`person1`和`person2`分别保存这`Person`的一个不同实例。它们都有一个`constructor`属性，指向`Person`。

```javascript
person1.constructor === Person // true
person1.constructor === person2.constructor; // true
```

对象类型检测，在这里可以用`constructor`的指向来判断，更可靠的方法是用`instanceof`。

```javascript
person1 instanceof Object; // true
person1 instanceof Person; // true
```

### 构造函数的使用

```javascript
// 当作构造函数使用
var person1 = new Person('Jack', 32, 'Doctor');
person1.sayName();

// 当作普通函数使用
Person('Jane', 19, 'Student'); // 添加到window
window.sayName();

// 在另一个对象到作用域调用
var o = new Object();
Person.call(o, 'Marry', 45, 'teacher');
o.sayName();
```

### 构造函数的问题
在前面的例子中，`person1`和`person2`都有一个名为`sayName()`的方法，但那两个方法不是同一个 `Function`的实例。

```javascript
person1.sayName == person2.sayName(); // false
```

创建两个完成同样任务的`Function`实例的确没有必要；况且有`this`对象在，根本不用在执行代码前就把函数绑定到特定对象上面。因此，大可像下面这样，通过把函数定义转移到构造函数外部来解决这个问题。

```javascript
function Person(name, age, job){
    this.name = name;
    this.age = age;
    this.job = job;
    this.sayName = sayName;
}
function sayName(){
    alert(this.name);
}
var person1 = new Person("Nicholas", 29, "Software Engineer");
var person2 = new Person("Greg", 27, "Doctor");
```

在这个例子中，我们把`sayName()`函数的定义转移到了构造函数外部。而在构造函数内部，我们将 `sayName`属性设置成等于全局的 `sayName` 函数。这样一来，由于 `sayName` 包含的是一个指向函数 的指针，因此 `person1` 和 `person2` 对象就共享了在全局作用域中定义的同一个 `sayName()`函数。这 样做确实解决了两个函数做同一件事的问题，可是新问题又来了:在全局作用域中定义的函数实际上只能被某个对象调用，这让全局作用域有点名不副实。而更让人无法接受的是:如果对象需要定义很多方法，那么就要定义很多个全局函数，于是我们这个自定义的引用类型就丝毫没有封装性可言了。好在，这些问题可以通过使用原型模式来解决。