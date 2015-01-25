var mongoose = require('mongoose');

module.exports = mongoose.model('Game', {
	dateCreated: Date,
	dateModified: Date,
	startTime: Date,
	endTime: Date,
	winningTeam: Number,
	roster: Array,
	scores: Array
});
