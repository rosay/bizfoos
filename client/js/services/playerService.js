/**
 * Handles loading players from DB and loading them into the bullpen.
 * The bullpen is the place a player is put in after being selected to play a game but before the game starts.
 */
app.factory('playerService', ['$http', function playerService ($http) {
	"use strict";

	/**
	 * Holds players retrieved from the DB to be displayed on the screen.
	 * @type {Array}
	 */
	playerService.players = [];
	/**
	 * Holds the players who have been selected to play a new game.
	 * @type {number}
	 */
	playerService.bullpenCount = 0;

    /**
     * Holds special team names
     */
    playerService.teamNames = [];

	/**
	 * Private function to get a players position in the players array.
	 * @param playerId
	 * @returns {number|*}
	 */
	var getPlayerIndex = function(playerId) {
		return _.findIndex(playerService.players, {"_id": playerId});
	};

	/**
	 * Get the number of players in the bullpen.
	 * @returns {number}
	 */
	playerService.getBullpenCount = function () {
		return playerService.bullpenCount;
	};

	/**
     * Server call to get all players from server.
     * @returns {*}
     */
    playerService.getPlayers = function () {
        return $http.get('/api/players')
            .success(function (data, status, headers, config) {
                for (var i = 0; i < data.length; i++) {
                    data[i].inBullpen = false;
                }

                if (playerService.players.length === 0) {
                    playerService.players = data;
                }
            })
            .error(function (data, status, headers, config) {
                console.log("No players showed up! Status: " + status);
            });
    };

    /**
     * Server call to get special team names
     * @returns {*}
     */
    playerService.getTeamNames = function () {
        return $http.get('/api/teamNames')
            .success(function (data, status, headers, config) {
                    playerService.teamNames = data;
            })
            .error(function (data, status, headers, config) {
                console.log("No teams assigned to teamNames! Status: " + status);
            });
    };

	/**
	 * Add a player to bullpen
	 * @param playerId
	 */
	playerService.addPlayerToBullpen = function (playerId) {
		if (playerService.bullpenCount < 4) {
			var playerIndex = getPlayerIndex(playerId);

			playerService.players[playerIndex].inBullpen = true;
			playerService.bullpenCount += 1;
		}
	};

	/**
	 * Remove a player from the bullpen
	 * @param playerId
	 */
	playerService.removePlayerFromBullpen = function (playerId) {
		var playerIndex = getPlayerIndex(playerId);

		playerService.players[playerIndex].inBullpen = false;
		playerService.bullpenCount -= 1;
	};

	playerService.getAllPlayersInBullpen = function () {
		return _.filter(playerService.players, { "inBullpen": true });
	};

	/**
	 * Clears the bullpen out completely
	 */
	playerService.clearBullpen = function () {
		var allInBullpen =  playerService.getAllPlayersInBullpen();

		for (var i = 0; i < allInBullpen.length; i++) {
			playerService.removePlayerFromBullpen(allInBullpen[i]._id);
		}
	};

	playerService.clearLosersFromBullpen = function (losers) {
		for (var i = 0; i < losers.length; i++) {
			playerService.removePlayerFromBullpen(losers[i]);
		}
	};

	return playerService;
}]);
