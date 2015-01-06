app.controller('GameController', ['gameService', 'rosterService', function(gameService, rosterService) {
	"use strict";

	var vm = this;

	gameService.checkGameReady();

	vm.title = "Let's play!";
	vm.scores = { 1: 0, 2: 0 };
	vm.gameOver = false;

	rosterService.createRoster();
	vm.players = rosterService.getRoster();
	vm.teamNames = rosterService.getTeamNames();

	gameService.setStartTime();

	vm.addScore = function(playerId) {
		gameService.addScore(playerId);
		vm.scores[1] = gameService.getScoresCount(1);
		vm.scores[2] = gameService.getScoresCount(2);
		vm.gameOver = gameService.isGameOver();
	};

	vm.removeLastScore = function() {
		gameService.removeLastScore();
		vm.scores[1] = gameService.getScoresCount(1);
		vm.scores[2] = gameService.getScoresCount(2);
		vm.gameOver = gameService.isGameOver();
	};
}]);

