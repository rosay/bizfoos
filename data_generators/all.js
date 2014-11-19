// set up ======================================================================
var mongoose	= require('mongoose');
var Player 		= require('../app/models/player');


// Connect to db ======================================================================
mongoose.connect("mongodb://localhost:27017/bizfoosTestDb"); // Connect to the db

var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function callback () {
	// yay!
});

var newPlayer = new Player({ name: "wut?"});

newPlayer.save(function(err, newPlayer) {
	if (err) {
		return console.log(err);
	}
	mongoose.connection.close();
});
