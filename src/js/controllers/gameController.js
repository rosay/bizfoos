app.controller('GameController', ['$scope', 'gameService', function($scope, gameService) {
	"use strict";

	$scope.title = "Game screen";
	$scope.players = gameService.getPlayers();
	$scope.totalScore = 0;						// This is just for testing, will not need to be on the actual screen

	$scope.addScore = function(playerId) {
		gameService.addScore(playerId);
		$scope.totalScore = gameService.getScores().length;
	};

	$scope.removeLastScore = function() {
		gameService.removeLastScore();
		$scope.totalScore = gameService.getScores().length;
	};

}]);

