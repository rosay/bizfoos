var mongoose = require('mongoose');

module.exports = mongoose.model('Game', {
	TeamOneOffense : String,
	TeamOneDefense : String,
	TeamTwoOffense : String,
	TeamTwoDefense : String,
	TeamOneFinalScore: Number,
	TeamTwoFinalScore: Number

});
