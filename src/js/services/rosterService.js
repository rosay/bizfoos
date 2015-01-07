/**
 * Handles everything to do with the players who are playing in the current game.
 */
app.factory('rosterService', ['playerService', function rosterService (playerService) {
	"use strict";

	/**
	 * Stores players in the game.
	 * Array of objects: { player_id: "guy@bizstream.com" team: 1, position: "offense" }
	 * @type {Array}
	 */
	var roster = [];

	/**
	 *  Teams and positions get merged with roster.
	 * @type [{team: number, position: string}]
	 */
	var teamsAndPositions = [
		{ team: 1, position: "offense" },
		{ team: 1, position: "defense" },
		{ team: 2, position: "offense" },
		{ team: 2, position: "defense" }
	];

	/**
	 * Takes an array, shuffles it's entries and returns it.
	 * Used to put players on random teams and positions.
	 * @param array
	 * @returns {Array}
	 */
	var shuffle = function (array) {
		var currentIndex = array.length, temporaryValue, randomIndex;

		// While there remain elements to shuffle...
		while (0 !== currentIndex) {

			// Pick a remaining element...
			randomIndex = Math.floor(Math.random() * currentIndex);
			currentIndex -= 1;

			// And swap it with the current element.
			temporaryValue = array[currentIndex];
			array[currentIndex] = array[randomIndex];
			array[randomIndex] = temporaryValue;
		}

		return array;
	};

	/**
	 * Used to get the all the players who are in the game.
	 * @returns {Array}
	 */
	var getRoster = function () {
		var bullpen = _.where(playerService.players, { 'inBullpen': true });

		if (bullpen.length) {
			// Combine
			roster = bullpen;
			_.merge(shuffle(roster), teamsAndPositions);
		}

		return roster;
	};

	/**
	 * Finds a player in the roster and returns they're team number. Returns 0 if player is not found in roster.
	 * @param playerId
	 * @returns {Number}
	 */
	var getTeamByPlayerId = function (playerId) {
		if (roster.length) {
			var playerIndex = _.findIndex(roster, {"_id" : playerId});
			var player = roster[playerIndex];

			return player.team;
		}

		return 0;
	};

	var getPlayerIdsByTeam = function (teamNumber) {
		if (roster.length) {
			var team = _.filter(roster, {"team": teamNumber});
			return _.map(team, "_id");
		}

		return [];
	};

	/**
	 * Returns the names of players in roster by team.
	 * @returns {{teamOne: *[], teamTwo: *[]}}
	 */
	var getTeamNames = function () {
		if (roster.length) {
			return { teamOne: [roster[0].name, roster[1].name], teamTwo: [roster[2].name, roster[3].name] }
		}
	};

	var clearRoster = function () {
		roster.length = 0;
	};

	return {
		getTeamByPlayerId: getTeamByPlayerId,
		getPlayerIdsByTeam: getPlayerIdsByTeam,
		getRoster: getRoster,
		getTeamNames: getTeamNames,
		clearRoster: clearRoster
	};
}]);
