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
	 * Get all the players who are in the game.
	 * @returns {Array}
	 */
	var getRoster = function () {
		return roster;
	};

	/**
	 * Creates the roster from the bullpen
	 */
	var createRoster = function () {
		var bullpen = playerService.getAllPlayersInBullpen();

		//var incumbents = _.filter(bullpen, {"status": "incumbent"});
        //
		//if (incumbents.length > 0) {
		//	roster
		//}

		if (bullpen.length) {
			// Combine
			roster = _.shuffle(bullpen);
			_.merge(roster, teamsAndPositions);
		}
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
		clearRoster: clearRoster,
		getTeamNames: getTeamNames,
		createRoster: createRoster
	};
}]);
