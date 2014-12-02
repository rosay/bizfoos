app.controller('PlayerController', ['$scope', '$http', 'screenService', 'gameService', function($scope, $http, screenService, gameService) {
	"use strict";

	var getCurrentScreen = function () {
		return screenService.getCurrentScreen();
	};

	// Gets player data
	$http({method: 'POST', url: 'http://localhost:3000/api/players'}).
		success(function (data, status, headers, config) {
			$scope.players = data;
		}).
		error(function (data, status, headers, config) {
			console.log("No players showed up! Status: " + status);
		});

	$scope.title = "Player list";
	$scope.showScreen = getCurrentScreen() == "player";
	$scope.selectedPlayers = [];

	$scope.changeScreen = function (screenName) {
		screenService.setCurrentScreen(screenName);
	};

	$scope.$on('screenChange', function(e, newScreen) {
		$scope.showScreen = getCurrentScreen() == "player";
	});

	$scope.addPlayer = function (playerName) {
		gameService.insertPlayer(playerName);
		$scope.selectedPlayers = gameService.getPlayers();
		console.log(gameService.getPlayers());
	};





}]);

