const path = require('path');
const http = require('http');
const fs = require('fs');
const url = require('url');
const mineTypes = require('./mine');

const port = 3000;

var server = http.createServer((req, res) => {
  let filePath = path.resolve(__dirname, 'src', 'index.html');
  fs.readFile(filePath, 'binary', (err, data) => {
    if(err) {
      res.writeHead(500, {
        'Content-Type': 'text/plain'
      });
      res.end(err);
    } else {
      res.writeHead(200, {
        'Content-Type': 'text/plain'
      });
      res.write(data, 'binary');
      res.end();
    }
  })
});

server.listen(port);

console.log('server listening on port:', port);
