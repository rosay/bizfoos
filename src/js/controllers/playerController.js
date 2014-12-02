app.controller('PlayerController', ['$scope', '$http', 'gameService', function($scope, $http, gameService) {
	"use strict";

	// Gets player data
	$http({method: 'POST', url: 'http://localhost:3000/api/players'}).
		success(function (data, status, headers, config) {
			$scope.players = data;
		}).
		error(function (data, status, headers, config) {
			console.log("No players showed up! Status: " + status);
		});

	$scope.title = "Player list";

	$scope.addPlayer = function (playerName) {
		gameService.insertPlayer(playerName);
		console.log(gameService.getPlayers());
	};
}]);

