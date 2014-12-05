var mongoose = require('mongoose');

module.exports = mongoose.model('Game', {
	roster: Array,
	scores: Array,
	startTime: Date,
	endTime: Date,
	winningTeam: Number
});
