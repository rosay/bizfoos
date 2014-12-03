var mongoose = require('mongoose');

module.exports = mongoose.model('Player', {
	_id  : String,
	name : String,
	pic  : String
});
