/**
* Handles everything to do with the current game being played.
*/
app.factory('gameService', ['rosterService', 'playerService', '$timeout', '$http', '$location', function gameService (rosterService, playerService, $timeout, $http, $location) {
	"use strict";

	var scores = [];	// Holds all scores for the game.
	var startTime;		// Game start time.
	var endTime;		// Game end time.

	/**
	 * Add a score
	 * @param playerId
	 */
	var addScore = function (playerId) {
		var team = rosterService.getTeamByPlayerId(playerId);

		if (!isGameOver()) {
			var score = { player_id: playerId, team: team, scoreTime: new Date() };
			scores.push(score);

			// Did that last score just end the game?
			if (isGameOver()) {
				setEndTime();
				postGame();
			}
		}
	};

	/**
	 * Deletes the last score.
	 */
	var removeLastScore = function () {
		if (scores.length) {
			scores.splice(scores.length - 1, 1);
		}
	};

	/**
	 * Get scores by team
	 * @param teamNum
	 * @returns {Number}
	 */
	var getScoresCount = function(teamNum) {
		var teamScores = _.where(scores, { team: teamNum });
		return teamScores.length;
	};

	/**
	 * Determines if the game is over or not.
	 * @returns {boolean}
	 */
	var isGameOver = function() {
		return getScoresCount(1) === 5 || getScoresCount(2) === 5;
	};

	/**
	 * Set the start of game time.
	 */
	var setStartTime = function() {
		startTime = new Date();
	};

	/**
	 * Set the end of game time.
	 */
	var setEndTime = function() {
		endTime = new Date();
	};

	/**
	 * Clean up the game data before sending it to the server.
	 * @returns {{}}
	 */
	var buildGameModel = function() {
		var game = {};
		game.roster = [];
		var roster = rosterService.getRoster();

		for (var i = 0; i < roster.length; i++) {
			game.roster[i] = {};
			game.roster[i].player_id = roster[i]._id;
			game.roster[i].position = roster[i].position;
			game.roster[i].team = roster[i].team;
		}

		game.scores = scores;
		game.startTime = startTime;
		game.endTime = endTime;

		if (getScoresCount(1) === 5) {
			game.winningTeam = 1;
		} else {
			game.winningTeam = 2;
		}


		return game;
	};

	/**
	 * Sends game to server for saving.
	 * @returns {*}
	 */
	var postGame = function () {
		var game = buildGameModel();

		return $http.post('/api/game/save', { "gameData": game }).
				success(function(data, status, headers, config) {
					return status;
				}).
				error(function(data, status, headers, config) {
					return status;
				});
	};

	/**
	 * Sends player back to players screen if the game is not ready.
	 */
	var checkGameReady = function () {
		var bullpen = _.where(playerService.players, { 'inBullpen': true });

		if (bullpen.length !== 4) {
			$location.path( "/players" );
		}
	};

	return {
		addScore: addScore,
		removeLastScore: removeLastScore,
		getScoresCount: getScoresCount,
		isGameOver: isGameOver,
		setStartTime: setStartTime,
		checkGameReady: checkGameReady
	};
}]);
