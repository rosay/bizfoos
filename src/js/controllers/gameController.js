app.controller('GameController', ['gameService', 'rosterService', function(gameService, rosterService) {
	"use strict";

	var vm = this;

	vm.title = "Let's play!";
	vm.scores = { 1: 0, 2: 0 };
	vm.gameOver = false;
	vm.players = rosterService.getRoster();

	vm.addScore = function(playerId) {
		gameService.addScore(playerId);
	};

	vm.removeLastScore = function() {
		gameService.removeLastScore();
	};
}]);

