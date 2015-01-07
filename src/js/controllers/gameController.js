app.controller('GameController', ['gameService', 'rosterService', 'playerService', '$location', function(gameService, rosterService, playerService, $location) {
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

	vm.startNewGame = function() {
		playerService.clearBullpen();
		rosterService.clearRoster();
		gameService.clearScores();
		$location.path('/player');
	};

	vm.keepWinners = function() {
		var losers = gameService.getLoserPlayerIds();
		playerService.clearLosersFromBullpen(losers);

		var winners = gameService.getWinnerPlayerIds();
		var winningTeam = gameService.getWinningTeam();

		playerService.markWinners(winners, winningTeam);

		rosterService.clearRoster();

		gameService.clearScores();
		$location.path('/player');


		// bootstrap winning team
		// swap positions


	};

	vm.keepPlayersNewGame = function() {
		// swap positions
		// start new game
	};

}]);

