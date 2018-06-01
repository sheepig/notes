const Writable = require('stream').Writable;
const writer = new Writable({
    write(chunk, encoding, cb) {
        setTimeout(() => {
            cb && cb();
        });
    }
})

function writeOneMillionTimes(writer, data, encoding, cb) {
    let i = 10000;
    write();
    function write() {
        let ok = true;
        while(i-- > 0 && ok) {
            ok = writer.write(data, encoding, i === 0 ? cb : null);
        }
        if (i > 0) {
            console.log('drain;', i);
            writer.once('drain', write);
        }
    }
}
writeOneMillionTimes(writer, 'simple', 'utf8', () => {
    console.log('end');
});
module.exports = {};