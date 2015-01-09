app.controller('GameController', ['gameService', 'rosterService', 'playerService', '$location', function(gameService, rosterService, playerService, $location) {
	"use strict";

	var vm = this;

	gameService.checkGameReady();

	vm.rematchCount = 0;

	vm.title = "Let's play!";
	vm.scores = { 1: 0, 2: 0 };
	vm.gameOver = false;

	rosterService.createRoster();

	vm.players = {
		"teamBlack": {
		"offense": {
			"name": "",
				"id": "",
				"pic": ""
		},
		"defense": {
			"name": "",
				"id": "",
				"pic": ""
		}
		},
			"teamOrange": {
			"offense": {
				"name": "",
					"id": "",
					"pic": ""
			},
			"defense": {
				"name": "",
					"id": "",
					"pic": ""
			}
		}
	};

	var setPlayers = function () {
		vm.players.teamBlack.offense = rosterService.getPlayer(1, "offense");
		vm.players.teamBlack.defense = rosterService.getPlayer(1, "defense");

		vm.players.teamOrange.offense = rosterService.getPlayer(2, "offense");
		vm.players.teamOrange.defense = rosterService.getPlayer(2, "defense");

	};

	setPlayers();

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
		var winningTeam = gameService.getWinningTeam();
		var losingTeam = gameService.getLosingTeam();

		rosterService.swapTeamPositions(winningTeam);

		playerService.clearLosersFromBullpen(losers);

		rosterService.clearTeamFromRoster(losingTeam);
		rosterService.swapTeams();

		$location.path('/player');

		gameService.clearScores();

		// bootstrap winning team
	};

	vm.swapTeamPositions = function (teamNum) {
		rosterService.swapTeamPositions(teamNum);

		setPlayers();
	};

	vm.rematch = function() {
		// Swap players positions
		rosterService.swapPositions();

		// Swap teams
		rosterService.swapTeams();

		// start new game
		gameService.clearScores();
		vm.scores[1] = gameService.getScoresCount(1);
		vm.scores[2] = gameService.getScoresCount(2);

		setPlayers();

		vm.gameOver = false;

		vm.rematchCount += 1;
	};

}]);

