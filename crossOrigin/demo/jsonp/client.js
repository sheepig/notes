const http = require('http');
const fs = require('fs');

var server = http.createServer((req, res) => {
	res.writeHead(200, {
		"Content-Type": "text/html"
	});
	fs.createReadStream(`${__dirname}/index.html`).pipe(res);
}).listen(3000);

console.log('client on port 3000');