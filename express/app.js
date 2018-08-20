const express = require('express');

var app = express();


app.get('/', function(req, res) {
	res.send('hello');
});

app.listen(3000, function() {
	console.log('express server on port 3000');
});