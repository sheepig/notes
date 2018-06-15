var EventEmitter = require('events').EventEmitter;
var fs = require('fs');
var content;

function readFileIfRequire(cb) {
    if(!content) {
        fs.readFile(__filename, 'utf-8', function(err, data) {
            content = data;
            console.log('read file require: required');
            cb(err, content);
        });
    } else {
        process.nextTick(function() {
            console.log('read file required: cache');
            cb(null, content);
        });
    }
}
readFileIfRequire(function(err, data){
    console.log('1. length:', data.length);
    readFileIfRequire(function(err, data2) {
        console.log('2. length:', data2.length);
    });
})
module.exports = {};/*  */