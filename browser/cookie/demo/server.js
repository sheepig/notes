const http = require('http');

var app = http.createServer((req, res) => {
	res.setHeader("Access-Control-Allow-Origin", "http://localhost:3000");
	res.setHeader("Access-Control-Allow-Credentials", "true");
	res.setHeader("Access-Control-Allow-Headers", "Content-Type,Content-Length, Authorization, Accept");
	res.writeHead(200, {
		"Content-Type": "text/json",
	});
	let data = JSON.stringify({data: 'success'});
	res.write(data, 'utf-8');
	res.end();
}).listen(3001);

console.log('server on port 3001');