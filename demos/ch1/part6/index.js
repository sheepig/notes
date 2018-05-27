// function Bomb() {
//     this.message = 'Boom!';
// }
// Bomb.prototype.explode = function() {
//     console.log(this.message);
// }
// var bomb = new Bomb();
// var timeId = setTimeout(bomb.explode.bind(bomb), 1000);
// clearTimeout(timeId);
var EventEmitter = require('events').EventEmitter;
function complexOperation() {
    console.log('complexOperation created');
    var event = new EventEmitter();
    process.nextTick(function(){
        event.emit('success');
    }); 
    // 1((callout-globals-nexttick-1))
    return event;
}
complexOperation().on('success', function(){
    console.log('success!!');
})
module.exports = {};