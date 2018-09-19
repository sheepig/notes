const express = require('express');
const path = require('path');
const fs = require('fs');

var app = express();
app.set('views', path.join(__dirname, 'index', 'html'));
app.use(express.static(__dirname + '/'));
app.all('*', function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Content-Type,Content-Length, Authorization, Accept");
    res.header("Access-Control-Allow-Methods", "PUT,POST,GET,DELETE,OPTIONS");
    if (req.method == "OPTIONS") res.send(200);
    else next();
});

app.get('/test', function(req, res) {
	res.cookie('yan', 'eee', {
        maxAge: '600000',
        httpOnly: true,
        secure: true
    });
    res.cookie('agg', 'sss', {
        maxAge: '600000'
    });
    res.send({
    	data: 'success'
    })
});

app.listen(3000, function() {
	console.log('client on 3000');
})