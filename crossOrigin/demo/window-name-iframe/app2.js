const http = require('http');
const fs = require('fs');
const url = require('url');

var server = http.createServer((req, res) => {
	var uri = url.parse(req.url);
	if (uri.pathname == '/b.html') {
		res.writeHead(200, {
			"Content-Type": "text/html"
		});
		fs.createReadStream(`${__dirname}/b.html`).pipe(res);
	}
}).listen(3001);

console.log('server on port 3001');