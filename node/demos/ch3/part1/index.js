var fs = require('fs');
// fs.readFile('./index.js', function(err, buf) {
//     console.log('is Buffer:', Buffer.isBuffer(buf));
//     console.log(buf.toString('ascii'));
    
// });
// var user = 'John';
// var password = "2999oir";
// var authString = user + ':' + password;
// var buf = new Buffer(authString);
// console.log(buf);
// console.log(buf.toString('base64'));
var encoding = 'base64';
var mime = 'image.jpeg';
var uriPrefix = 'data:' + mime + ';' + encoding + ',';
var data = fs.readFileSync('./woodstock.jpeg').toString(encoding);
var uri = uriPrefix + data;
var data2 = uri.split(',')[1];
var buf = Buffer(data2, encoding);
fs.writeFileSync('./second.png', buf);



module.exports = {};