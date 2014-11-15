var http = require('http');
var mongoose = require('mongoose');

var server = http.createServer(function(request, respsonse) {
	respsonse.writeHead(200);
	respsonse.end('Hello Http');
});
server.listen(8888);
