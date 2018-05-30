// example 4.10
var EventEmitter = require('events').EventEmitter;

class Pulsar extends EventEmitter {
    constructor (speed, times) {
        super();
        this.speed = speed;
        this.times = times;
        this.on('newListener', (name, listener) => {
            if (name === 'pulse') {
                this.start();
            }
        })
    }
    start () {
        // var self = this;
        var id = setInterval(() => {
            this.emit('pulse');
            this.time--;
            if (this.time === 0) {
                clearInterval(id);
                process.exit(0);
            }
        }, this.speed);
    }
    stop () {
        if (this.listeners('pulse').length === 0) {
            throw new Error('No listener have been added');
        }
    }
}
var pulsar = new Pulsar(500, 5);
pulsar.on('pulse', function(){
    console.log('.');
});
pulsar.stop();