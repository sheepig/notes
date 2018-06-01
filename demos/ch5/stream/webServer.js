// example 5.1
var http = require('http');
var fs = require('fs');
var path = require('path');
var zlib = require('zlib');

http.createServer(function(req, res) {
    res.writeHead(200, { 'content-encoding': 'gzip'} );
    fs.createReadStream(path.resolve(__dirname, 'index.html'))
    .pipe(zlib.createGzip())
    .pipe(res);
    console.log('listening... 8080');
}).listen(8080);
module.exports = {};