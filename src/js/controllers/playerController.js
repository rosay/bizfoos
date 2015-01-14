app.controller('PlayerController', ['gameService', 'playerService', function (gameService, playerService) {
	"use strict";

	var vm = this;

	// Setup controller
	vm.playerHeader = "Player list";
	vm.bullpenHeader = "Bullpen";
	vm.players = [];
	vm.bullpenCount = 0;
	vm.selectedPlayer;

	playerService.getPlayers()
		.then(function() {
			vm.players = playerService.players;
			vm.selectedPlayer = vm.players[0];
		});

	vm.bullpenCount = playerService.getBullpenCount();
	

	vm.addPlayerToBullpen = function (playerId) {
		playerService.addPlayerToBullpen(playerId);
		vm.bullpenCount = playerService.getBullpenCount();
		var audio = new Audio('sounds/add.mp3');
		audio.play();
	};

	vm.removePlayerFromBullpen = function (playerId) {
		playerService.removePlayerFromBullpen(playerId);
		vm.bullpenCount = playerService.getBullpenCount();
	};
}]);

