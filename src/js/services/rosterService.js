/**
 * Handles everything to do with the players who are playing in the current game.
 */
app.factory('rosterService', ['playerService', function rosterService (playerService) {
	"use strict";

	/**
	 * Stores players in the game.
	 * Array of objects: { _id: "guy@bizstream.com" team: 1, position: "offense" }
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
	 * Creates the roster from the bullpen
	 */
	var createRoster = function () {
		var bullpen = playerService.getAllPlayersInBullpen();

		if (roster.length === 0) {
			if (bullpen.length) {
				// Combine
				roster = _.shuffle(bullpen);
				_.merge(roster, teamsAndPositions);
			}
		} else {
			var emptyTeam = getEmptyTeam();
			var newPlayers = [];

			for (var i = 0; i < bullpen.length; i++) {
				var playerIndex = _.findIndex(roster, {"_id": bullpen[i]._id});

				if (playerIndex === -1) {
					newPlayers.push(bullpen[i]);
				}
			}

			var pos1 = Math.random() > .5 ? "offense" : "defense";
			var pos2 = pos1 === "offense" ? "defense" : "offense";

			var positions = [pos1, pos2];

			for (var i = 0; i < newPlayers.length; i++) {
				newPlayers[i].team = emptyTeam;
				newPlayers[i].position = positions[i];

				roster.push(newPlayers[i]);

				//for (var j = 0; j < roster.length; j++) {
				//	if (_.isEmpty(roster[j])) {
				//		newPlayers[i].team = emptyTeam;
				//		newPlayers[i].position = positions[i];
                //
				//		roster[j] = newPlayers[i];
				//	}
				//}
			}
		}
	};

	/**
	 * Get all the players who are in the game.
	 * @returns {Array}
	 */
	var getRoster = function () {
		return roster;
	};

	var getEmptyTeam = function () {
		for (var i = 0; i < roster.length; i++) {
			if (!_.isEmpty(roster[i])) {
				return roster[i].team === 1 ? 2 : 1;
			}
		}

		return 0;
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
			var team1 = _.filter(roster, {"team": 1});
			var team2 = _.filter(roster, {"team": 2});

			return { teamOne: [team1[0].name, team1[1].name], teamTwo: [team2[0].name, team2[1].name] };
		}
	};

	/**
	 * Clear losing team from roster
	 */
	var clearTeamFromRoster = function (teamNum) {
		var team = getPlayerIdsByTeam(teamNum);

		for (var i = 0; i < team.length; i++) {
			var playerIndex = _.findIndex(roster, {"_id" : team[i]});
			roster.splice(playerIndex, 1);
		}
	};

	/**
	 * Swaps player positions in the roster
	 */
	var swapPositions = function () {
		for (var i = 0; i < roster.length; i++) {
			roster[i].position = roster[i].position === "offense" ? "defense" : "offense";
		}
	};

	/**
	 * Swaps player positions for one team in the roster
	 */
	var swapTeamPositions = function (teamNum) {
		var team = getPlayerIdsByTeam(teamNum);

		for (var i = 0; i < team.length; i++) {
			var playerIndex = _.findIndex(roster, {"_id" : team[i]});
			roster[playerIndex].position = roster[playerIndex].position === "offense" ? "defense" : "offense";
		}
	};

	/**
	 * Swaps the team numbers each player is on
	 */
	var swapTeams = function () {
		for (var i = 0; i < roster.length; i++) {
			if (!_.isEmpty(roster[i])) {
				roster[i].team = roster[i].team === 1 ? 2 : 1;
			}
		}
	};

	/**
	 * Gets the team
	 */
	var getPlayer = function (teamNum, position) {
		var player = _.filter(roster, {"team": teamNum, "position": position});

		if (player.length) {
			// let's force some first and last names until the database get's them
			if (/\s/.test(player.name)) {
				var aNames = player.name.split(" ", 2);
				player.firstName = aNames[0];
				player.lastName  = aNames[1];
			}
			return player[0];
		}

		return {};
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
		createRoster: createRoster,
		swapPositions: swapPositions,
		swapTeams: swapTeams,
		getPlayer: getPlayer,
		swapTeamPositions: swapTeamPositions,
		clearTeamFromRoster: clearTeamFromRoster
	};
}]);
