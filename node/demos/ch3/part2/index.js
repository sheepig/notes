var fs = require('fs');
fs.readFile('./world.dbf', function(err, buf) {
    console.log(Buffer.isBuffer(buf));
    
});
module.exports = {};