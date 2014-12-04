// Responsible handling the current screen
app.factory('gameService', ['playerService', function (playerService) {
	"use strict";

	var scores = [];

	var getPlayers = function () {
		return players;
	};

	var addScore = function (playerId) {
		var newScore = { player_id: playerId, ScoreTime: new Date() };

		scores.push(newScore);
	};

	var removeLastScore = function () {
		if (scores.length) {
			return scores.splice(scores.length - 1, 1);
		} else {
			return [];
		}
	};

	var getScores = function() {
		return scores;
	};

	return {
		getPlayers: getPlayers,
		addScore: addScore,
		removeLastScore: removeLastScore,
		getScores: getScores
	};
}]);
