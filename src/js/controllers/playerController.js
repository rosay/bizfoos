app.controller('PlayerController', ['gameService', 'playerService', 'rosterService', function (gameService, playerService, rosterService) {
	"use strict";

	var vm = this;

	// Setup controller
	vm.playerHeader = "Player list";
	vm.bullpenHeader = "Bullpen";
	vm.players = [];
	vm.bullpenCount = 0;

	playerService.getPlayers()
		.then(function() {
			vm.players = playerService.players;
		});

	vm.addPlayerToBullpen = function (playerId) {
		playerService.addPlayerToBullpen(playerId);
		vm.bullpenCount = playerService.getBullpenCount();
	};

	vm.removePlayerFromBullpen = function (playerId) {
		playerService.removePlayerFromBullpen(playerId);
		vm.bullpenCount = playerService.getBullpenCount();
	};
}]);

