var util = require('util');
var events = require('events');

var AudioDevice = {
    play: function (track) {
        console.log('track:', track);
    },
    stop: function () {

    }
};
function MusicPlayer() {
    this.playing = false;
    events.EventEmitter.call(this);
}

util.inherits(MusicPlayer, events.EventEmitter);
var musicPlayer = new MusicPlayer();

musicPlayer.on('play', function(track) {
    this.playing = true;
    console.log('play events: 1');
    AudioDevice.play(track);
});

musicPlayer.on('stop', function() {
    this.playing = false;
    console.log('stop events');  
    AudioDevice.stop();
});
function play() {
    this.playing = true;
    console.log('play events: 2');
}
musicPlayer.on('play', play);
// musicPlayer.removeListener('play', play);
// musicPlayer.removeAllListeners('play');

musicPlayer.emit('play', 'HHHMMM');
setTimeout(() => {
    musicPlayer.emit('stop');
}, 1000);