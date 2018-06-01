var fs = require('fs');
var Transform = require('stream').Transform;
var path = require('path');

class CSVParser extends Transform {
    constructor () {
        super();
        this.value = '';
        this.headers = [];
        this.values = [];
        this.line = 0;
    }
    _transform(chunk, encoding, cb) {
        let c;
        let i;
        chunk = chunk.toString();
        for (i = 0; i < chunk.length; i++) {
            c = chunk.chatAt(i);
            if (c === ',') {
                this.addValue();
            } else if (c === '\n') {
                this.addValue();
                if (this.line > 0) {
                    this.push(JSON.stringify(this.toObject()));
                }
                this.values = [];
                this.line++;
            } else {
                this.value += c;
            }
        }
        cb && cb();
    }
    toObject() {
        let i;
        let obj = {};
        for (i = 0; i < this.header.length; i++) {
            obj[this.headers[i]] = this.value(i);
        }
        return obj;
    }
    addValue() {
        if (this.line === 0) {
            this.headers.push(this.value);
        } else {
            this.values.push(this.value);
        }
        this.value = '';
    }
}

var parser = new CSVParser();
fs.createReadStream(path.resolve(__dirname, 'sample.csv'))
    .pipe(parser)
    .pipe(process.stdout);
module.exports = {};