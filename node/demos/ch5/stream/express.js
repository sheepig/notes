var express = require('express');
var stream = require('stream');
var util = require('util');

// var app = express();
// app.get('/', function(req, res) {
//    res.send('hello-world');
// });
// app.listen(8080);

var app = express();
class StatStream extends stream.Readable {
    constructor (limit) {
        super();
        this.limit = limit;
    }
    _read (size) {
        if (this.limit === 0) {
            this.push();
        } else {
            this.push(util.inspect(process.memoryUsage()));
            this.push('n');
            this.limit--;
        }
    }
}

app.get('/', function (req, res) {
    let statStream = new StatStream(10);
    statStream.pipe(res);
});
app.listen(8080);