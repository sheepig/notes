const http = require('http');
const url = require('url');

var server = http.createServer();

server.on('request', (req, res) => {
	var params = url.parse(req.url).query;
	var query = {};
	paramList = params.split(/\s*&\s*/);
	for (let i = 0; i < paramList.length; i++) {
		let obj = {};
		let params = paramList[i].split(/\s*=\s*/);
		obj[params[0]] =  params[1] ? params[1] : null;
		Object.assign(query, obj);
	}
	delete paramList;
	let fn = query.callback;
	res.writeHead(200, {
		'Content-Type': 'text/javascript'
	});
	res.write(fn + '(' + JSON.stringify(query) + ')');
	res.end();
})

server.listen('3001');

console.log('server on port 3001');