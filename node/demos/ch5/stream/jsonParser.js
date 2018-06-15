// example 5.6
var stream = require('stream');
var util = require('util');
var fs = require('fs');
var path = require('path');

class JSONLineReader extends stream.Readable {
    constructor (source) {
        super();
        this._source = source;
        this._foundLineEnd = false;
        this._buffer = '';
        source.on('readable', () => {
            this.read();
        });
    }
    read (size) {
        let chunk;
        let line;
        let lineIndex;
        let result;

        if (this._buffer.length === 0) {
            chunk = this._source.read();
            this._buffer += chunk;
        }
        lineIndex = this._buffer.indexOf('\n');
        while (lineIndex !== -1) {
            line = this._buffer.slice(0, lineIndex);           
            if (line) {
                result = JSON.parse(line);
                this._buffer = this._buffer.slice(lineIndex + 1);
                this.emit('object', result);
            } else {
                this._buffer = this._buffer.slice(1);
            }
            lineIndex = this._buffer.indexOf('\n');
        }
    }
}

var input = fs.createReadStream(path.resolve(__dirname, 'json-line.txt'), {
    encoding: 'utf8'
});
var jsonLineReader = new JSONLineReader(input);

jsonLineReader.on('object', function(obj) {
    console.log('pos:', obj.position, '- letter:', obj.letter);
});
module.exports = {};