var zlib = require('zlib');
var database = [['foo'], [], ['foo'], [], [], [], [], []];
let bitmasks = [1, 2, 3, 4, 8, 16, 32, 64, 128];
let header = new Buffer(2);
header[0] = 8;
header[1] = 0;
zlib.deflate('my message', function(err, deflateBuf) {
    if (err) {
        console.error(err);
        return;
    }
    let message = Buffer.concat([header, deflateBuf]);
    store(message);
});

function store (buf) {
    let db = buf[0];
    console.log('db:', db);
    
    let key = buf.readUInt8(1);
    console.log('key:', key);
    
    if (buf[2] === 0x78) {
        zlib.inflate(buf.slice(2), function(err, inflatedBuf) {
            if(err) {
                console.error(err);
                return;
            }
            let data = inflatedBuf.toString();
            bitmasks.forEach(function(bitmask, index) {            
                if ((db & bitmask) === bitmask) { // db matched
                    database[index][key] = data;
                    // console.log('database:', database);
                }
            });
        })
    }
}
module.exports = {};
