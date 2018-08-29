const http = require('http');
const fs = require('fs');
const url = require('url');

var server = http.createServer((req, res) => {
	var uri = url.parse(req.url);
	if (uri.pathname == '/index.html') {
		res.writeHead(200, {
			"Content-Type": "text/html"
		});
		fs.createReadStream(`${__dirname}/index.html`).pipe(res);
	} else if (uri.pathname== '/proxy.html') {
		res.writeHead(200, {
			'Content-Type': 'text/html'
		});
		res.end();
	}
}).listen(3000);

console.log('server on port 3000');