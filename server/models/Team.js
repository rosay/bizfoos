var mongoose = require('mongoose');

module.exports = mongoose.model('Team', {
    name : String,
    players: [String]
});