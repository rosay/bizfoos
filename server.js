// set up ======================================================================
var express 	= require('express');
var app			= express();
var mongoose	= require('mongoose');
var bodyParser 	= require('body-parser');
var open        = require('open');

app.use( bodyParser.json() );       // to support JSON-encoded bodies
app.set('port', (process.env.PORT || 3000));
app.set('env', (process.env.NODE_ENV || "dev"));

// configuration ===============================================================
mongoose.connect("mongodb://localhost:27017/bizfoos"); // Connect to the db
app.use(express.static(__dirname + '/client'));

// routes ======================================================================
require('./server/routes.js')(app);

// listen (start app with node server.js) ======================================
var server = app.listen(app.get('port'), function () {
	var host = server.address().address;
	var port = server.address().port;

	console.log('Bizfoos listening at http://%s:%s', host, port);

    if (app.get('env') === "dev") {
        open("http://" + host + ":" + port);
    }
});
