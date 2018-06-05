var stream = require('stream');

class MemoryStream extends stream.Readable {
    constructor() {
        super();
        this.isTTY = process.stdout.isTTY;
    }
    _read() {
        let text = JSON.stringify(process.memoryUsage()) + '\n';
        if (this.isTTY) {
            this.push('u001b[32m' + text + 'u001b[39m');
        } else {
            this.push(text);
        }
    }
}

class OutputStream extends stream.Writable {
    constructor() {
        super();
        this.on('pipe', function(dest) {
            dest.isTTY = this.isTTY;
        }.bind(this));
    }
    _write() {
        
    }
}