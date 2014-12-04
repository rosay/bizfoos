// Responsible handling the current screen
app.factory('gameService', ['rosterService', function gameService (rosterService) {
	"use strict";

	var scores = [];

	var addScore = function (playerId) {
		var team = rosterService.getTeamByPlayerId(playerId);
		var scoreCount = getScoresCount(team);

		if (scoreCount < 5) {
			var score = { player_id: playerId, team: team, ScoreTime: new Date() };
			scores.push(score);
		}
	};

	var removeLastScore = function () {
		if (scores.length) {
			scores.splice(scores.length - 1, 1);
		}
	};

	var getScoresCount = function(teamNum) {
		var teamScores = _.where(scores, { team: teamNum });
		return teamScores.length;
	};

	return {
		addScore: addScore,
		removeLastScore: removeLastScore,
		getScoresCount: getScoresCount
	};
}]);
