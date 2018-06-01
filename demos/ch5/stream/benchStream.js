var fs = require('fs');
var zlib = require(zlib);

function benchStream(inSize, outSize) {
    let time = process.hrtime();
    let watermark = process.memoryUsage().rss;
    
}