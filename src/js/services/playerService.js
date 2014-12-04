app.factory('playerService', ['$http', function playerService ($http) {
	"use strict";

	playerService.players = [];
	playerService.bullpenCount = 0;

	var getPlayerIndex = function(playerId) {
		return _.findIndex(playerService.players, {"_id": playerId});
	};

	playerService.getBullpenCount = function () {
		return playerService.bullpenCount;
	};

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

	playerService.addPlayerToBullpen = function (playerId) {
		if (playerService.bullpenCount < 4) {
			var playerIndex = getPlayerIndex(playerId);

			playerService.players[playerIndex].inBullpen = true;
			playerService.bullpenCount += 1;
		}
	};

	playerService.removePlayerFromBullpen = function (playerId) {
		var playerIndex = getPlayerIndex(playerId);

		playerService.players[playerIndex].inBullpen = false;
		playerService.bullpenCount -= 1;
	};

	return playerService;
}]);
