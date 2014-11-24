// Responsible handling the current screen
app.factory('gameService', ['$rootScope', function ($rootScope) {
	"use strict";

	// store players in the game
	
	var players = [];
	
	var insertPlayer = function (playerId) {
		players.push(playerId);
	};  
	
	var getPlayers = function () {
		return players;
	};
	
	return {
		insertPlayer: insertPlayer,
		getPlayers: getPlayers
	}
	
	// store scores
	
	
	
}]);
