var args = {
    '-h': displayHelp,
    '-r': readFile
};

function displayHelp() {
    console.log('Argument processor:', args);
}

function readFile(file) {
    if(file && file.length) {
        console.log('Reading:', file);
        console.time('read');
        var stream = require('fs').createReadStream(file);
        stream.on('end', function() {
            console.timeEnd('read');
        });
        stream.pipe(process.stdout);
    } else {
        console.error('A file must be provided with the -r option');
        process.exit(-1);
    }
}

// if (process.argv.length > 0) {
//     console.log(process.argv);
//     process.argv.forEach(function(arg, index) {
//         args.apply(this, process.argv.slice(index + 1));
//     });
// }

module.exports = {
    args,
    displayHelp,
    readFile
};