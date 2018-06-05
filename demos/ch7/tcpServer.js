var net = require('net');
var clients = 0;

var server = net.createServer(function(client) {
    clients++;
    let clientId = clients;
    console.log('client connect:', clientId);
    client.on('end', function() {
        console.log('client closed:', clientId);
    });
    client.write('welcome client:' + clientId + '\n');
    client.pipe(client);
});
server.listen(8080, function() {
    console.log('listening on port 8080');
});