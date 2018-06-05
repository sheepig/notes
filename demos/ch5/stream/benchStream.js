var fs = require('fs');
var zlib = require('zlib');
var path = require('path');

function benchStream(inSize, outSize) {
    let time = process.hrtime();
    let watermark = process.memoryUsage().rss;
    let input = fs.createReadStream(path.resolve(__dirname, 'benchStream.js'), {
        bufferSize: inSize
    });
    let gzip = zlib.createGzip({
        chunkSize: inSize
    });
    let output = fs.createWriteStream('out.gz', {
        bufferSize: inSize
    });
    let memoryCheck = setInterval(function() {
        let rss = process.memoryUsage().rss;
        if (rss > watermark) {
            watermark = rss;
        }
    }, 50);
    input.on('end', function() {
        let memoryEnd = process.memoryUsage();
        clearInterval(memoryCheck);
        let diff = process.hrtime(time);
        console.log([
            inSize,
            outSize,
            (diff[0] * 1e9 + diff[1]) / 1000000,
            watermark / 1024].join(', '));
    });
    input.pipe(gzip).pipe(output);
    return input;
}

var fileSize = 128;
var zipSize = 5024;

function run(times) {
    benchStream(fileSize, zipSize).on('end', function() {
        times--;
        fileSize *= 2;
        zipSize *= 2;

        if (times > 0) {
            run(times);
        }
    });
}

run(10);