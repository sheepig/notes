var EventEmitter = require('events').EventEmitter;
// var util = require('util');

class EventWatcher extends EventEmitter {

}
var eventWatcher = new EventWatcher();
eventWatcher.on('newListener', function (name, listener) {
    console.log('name:', name);
});

eventWatcher.on ('a listener', function() {
    console.log('a listener');
})
