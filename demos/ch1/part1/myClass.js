function MyClass() {
}

MyClass.prototype = {
    value: 1,
    method: function() {
        return 'hello';
    }
};
var myClass = new MyClass();
module.exports = myClass;
