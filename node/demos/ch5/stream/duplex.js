var Duplex = require('stream').Duplex;
class HungryStream extends Duplex {
    constructor () {
        super();
        this.value = 'HungryStream'
        this.waiting = false;
    }
    _write(chunk, encoding, cb) {
        this.waiting = false;
        this.push('\u001b[32m' + chunk + '\u001b[39m');
        cb && cb();
    }
    _read(size) {
        if (!this.waiting) {
            this.push('feed me data > ');
            this.waiting = true;
        }
    }
}
var hungryStream = new HungryStream();
process.stdin.pipe(hungryStream).pipe(process.stdout);
module.exports = {};