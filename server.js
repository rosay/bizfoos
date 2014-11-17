// set up ======================================================================
var express 	= require('express');
var app			= express();
var mongoose	= require('mongoose');
var http		= require('http');

// configuration ===============================================================
mongoose.connect("mongodb://localhost:27017/bizfoosDevDb"); // Connect to the db
app.use(express.static(__dirname + '/src'));

// routes ======================================================================
require('./app/routes.js')(app);

// listen (start app with node server.js) ======================================
var server = app.listen(3000, function () {
	var host = server.address().address;
	var port = server.address().port;

	console.log('Example app listening at http://%s:%s', host, port);
});
