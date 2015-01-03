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

					playerService.players = data;
				})
				.error(function (data, status, headers, config) {
					console.log("No players showed up! Status: " + status);
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

	return playerService;
}]);
