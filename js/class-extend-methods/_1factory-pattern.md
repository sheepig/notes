> 参考：JavaScript高级程序设计（第三版）

## 工厂模式
考虑到在ECMAScript中无法创建类，开发人员就发明了一种函数，用函数来封装以特定接口创建对象到细节。
```javascript
function createPerson(name, age, job) {
    var o = new Object();
    o.name = name;
    o.age = age;
    o.job = job;
    o.sayName = function(){
        console.log(this.name);
    };
    return o;
}
```
工厂模式没有解决**对象识别问题**（怎样知道一个对象到类型）。