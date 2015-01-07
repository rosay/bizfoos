app.controller('PlayerController', ['gameService', 'playerService', function (gameService, playerService) {
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

	vm.bullpenCount = playerService.getBullpenCount();

	vm.addPlayerToBullpen = function (playerId) {
		playerService.addPlayerToBullpen(playerId);
		vm.bullpenCount = playerService.getBullpenCount();
	};

	vm.removePlayerFromBullpen = function (playerId) {
		playerService.removePlayerFromBullpen(playerId);
		vm.bullpenCount = playerService.getBullpenCount();
	};
}]);

