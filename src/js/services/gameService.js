// Responsible handling the current screen
app.factory('gameService', ['rosterService', '$timeout', '$http', function gameService (rosterService, $timeout, $http) {
	"use strict";

	var scores = [];
	//var game = {};
	var startTime;
	var endTime;
	var winningTeam;

	var addScore = function (playerId) {
		var team = rosterService.getTeamByPlayerId(playerId);
		var scoreCount = getScoresCount(team);

		if (scoreCount < 5) {
			var score = { player_id: playerId, team: team, scoreTime: new Date() };
			scores.push(score);
		}

		if (isGameOver()) {
			setEndTime();
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

	var isGameOver = function() {
		return getScoresCount(1) === 5 || getScoresCount(2) === 5;
	};

	var setStartTime = function() {
		startTime = new Date();
	};

	var setEndTime = function() {
		endTime = new Date();
	};

	var buildGameModel = function() {
		var game = {};

		game.roster = rosterService.getRoster();
		game.scores = scores;
		game.startTime = startTime;
		game.endTime = endTime;
		game.winningTeam = winningTeam;

		return game;
	};

	var postGame = function () {

		if (Object.keys(game).length === 0) {
			buildGameModel();
		}

		return $http.post('/api/game/save', game).
				success(function(data, status, headers, config) {
					// this callback will be called asynchronously
					// when the response is available
				}).
				error(function(data, status, headers, config) {
					// called asynchronously if an error occurs
					// or server returns response with an error status.
				});
	};

	return {
		addScore: addScore,
		removeLastScore: removeLastScore,
		getScoresCount: getScoresCount,
		isGameOver: isGameOver,
		setStartTime: setStartTime,
		postGame: postGame
	};
}]);
