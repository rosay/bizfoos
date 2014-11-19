var mongoose = require('mongoose');

module.exports = mongoose.model('Score', {
	player_Id : String,
	game_Id: String,
	ScoreTime : Date
});
