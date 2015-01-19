/**
* Handles everything to do with the current game being played.
*/
app.factory('gameService', ['rosterService', 'playerService', 'configService', 'announcerService', '$timeout', '$http', '$location', function gameService (rosterService, playerService, configService, announcerService, $timeout, $http, $location) {
	"use strict";

	var scores = [];	// Holds all scores for the game.
	var startTime;		// Game start time.
	var endTime;		// Game end time.

	/**
	 * Clears out all score data.
	 */
	var clearScores = function () {
		scores.length = 0;
	};

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

		var oMessage = announcerService.scorePoint({
			"playerid": playerId, 
			"power":  -42 /* should be a number 0-9. -42 == random */
		})
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
	var getScoresCount = function (teamNum) {
		var teamScores = _.where(scores, { team: teamNum });
		return teamScores.length;
	};

	/**
	 * Determines if the game is over or not.
	 * @returns {boolean}
	 */
	var isGameOver = function () {
		return getScoresCount(1) === configService.getScoreLimit() || getScoresCount(2) === configService.getScoreLimit();
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
	var setEndTime = function () {
		endTime = new Date();
	};

	/**
	 * Gets the winning team number. Returns 0 if no team has won.
	 * @returns {number}
	 */
	var getWinningTeam = function () {
		if (isGameOver()) {
			if (getScoresCount(1) === configService.getScoreLimit()) {
				return 1;
			}

			if (getScoresCount(2) === configService.getScoreLimit()) {
				return 2;
			}
		}
		return 0;
	};

	/**
	 * Gets the losing team number. Returns 0 if no team has won.
	 * @returns {number}
	 */
	var getLosingTeam = function () {
		var winningTeam = getWinningTeam();

		if (winningTeam === 0) {
			return 0;
		}

		return winningTeam === 1 ? 2 : 1;
	};

	/**
	 * Gets the losing team members player Ids. Returns 0 if no team has won.
	 * @returns {Array}
	 */
	var getLoserPlayerIds = function () {
		var losingTeam = getLosingTeam();

		if (losingTeam === 0) {
			return [];
		}

		return rosterService.getPlayerIdsByTeam(losingTeam);
	};

	var getWinnerPlayerIds = function () {
		var winningTeam = getWinningTeam();

		if (winningTeam === 0) {
			return [];
		}

		return rosterService.getPlayerIdsByTeam(winningTeam);
	};

	/**
	 * Clean up the game data before sending it to the server.
	 * @returns {{}}
	 */
	var buildGameModel = function () {
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

		if (getScoresCount(1) === configService.getScoreLimit()) {
			game.winningTeam = 1;
		} else {
			game.winningTeam = 2;
		}

		var winningTeam = getWinningTeam();

		if (winningTeam != 0) {
			game.winningTeam = winningTeam;
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

	var initializeAnnouncer = function(roster){
		announcerService.init({
			"pointsNeededToWin": configService.getScoreLimit(),
			"roster" : roster,
			/*
			"teams" : [
				{
					"color": "black",
					"team": "The Black Team", // eventually Team names: The Dream Team
					//"probabilty": .80
				},
				{
					"color": "yellow",
					"team": "The Yellow Team", // eventually team names: The Avengers
					//"probabilty": .20
				}
			],
			"players" : [
				{	//0
					"playerid": players.blackO.id,
					"color": "black",
					"position": "o",
					"team": "The Black Team",
					"names": players.blackO.names
				},
				{	//1
					"playerid": players.blackD.id,
					"color": "black",
					"position": "d",
					"team": "The Dream Team",
					"names": players.blackD.names
				},
				{	//2
					"playerid": players.yellowO.id,
					"color": "yellow",
					"position": "o",
					"team": "The Avengers",
					"names": players.yellowO.names
				},
				{	//3
					"playerid": players.yellowD.id,
					"color": "yellow",
					"position": "d",
					"team": "The Avengers",
					"names": players.yellowD.names
				}
			], // end array of peole
			*/
			"useTTS": true,
			"debug": false
		});
	}

	return {
		addScore: addScore,
		removeLastScore: removeLastScore,
		getScoresCount: getScoresCount,
		isGameOver: isGameOver,
		setStartTime: setStartTime,
		checkGameReady: checkGameReady,
		getLoserPlayerIds: getLoserPlayerIds,
		getWinnerPlayerIds: getWinnerPlayerIds,
		getWinningTeam: getWinningTeam,
		getLosingTeam: getLosingTeam,
		clearScores: clearScores,
		initializeAnnouncer: initializeAnnouncer
	};
}]);
