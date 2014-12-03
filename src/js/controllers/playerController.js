app.controller('PlayerController', ['$scope', '$http', 'gameService', function($scope, $http, gameService) {
	"use strict";

	$scope.players = [];
	$scope.selectedPlayers = [];
	$scope.title = "Player list";

	// Gets player data
	$http({method: 'POST', url: 'http://localhost:3000/api/players'}).
		success(function (data, status, headers, config) {
			$scope.players = data;
		}).
		error(function (data, status, headers, config) {
			console.log("No players showed up! Status: " + status);
		});

	$scope.addPlayerToGame = function (playerId) {
		// Get the player object from the array of players
		var playerIndex = _.findIndex($scope.players, {"_id" : playerId});
		var player = $scope.players[playerIndex];

		// Pass the player object to the game service.
		// If game service is able to successfully insert the player, it will return true.
		var insertSuccessful = gameService.insertPlayer(player);

		// Remove the player from the choice of players
		if (insertSuccessful) {
			$scope.players.splice(playerIndex, 1);
		}

		// Refresh the selectedPlayers list
		$scope.selectedPlayers = gameService.getPlayers();
	};

	$scope.removePlayerFromGame = function (playerId) {
		var removedPlayer = gameService.deletePlayer(playerId);

		// Remove the player from the choice of players
		$scope.players.push(removedPlayer);

		// Refresh the selectedPlayers list
		$scope.selectedPlayers = gameService.getPlayers();
	};
}]);

