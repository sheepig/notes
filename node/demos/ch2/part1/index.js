var myClass = require('./myClass');
var module2 = require('./module-2');

// console.log(myClass.method());
// console.log(module2.method());
// console.log(module2.method2());

console.log(module2.num);
console.log(require.resolve('./module-2'));
console.log(delete require.cache[require.resolve('./module-2')]);
module.exports = {};