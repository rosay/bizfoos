// Responsible handling the current screen
app.factory('gameService', ['$rootScope', function ($rootScope) {
	"use strict";

	// store players in the game
	var players = [];
	
	var insertPlayer = function (playerId) {

		var isInGame = players.some(function(player){
			return playerId === player;
		});

		if (!isInGame &&  players.length < 4) {
			players.push(playerId);
		}
	};  

	var deletePlayer = function (playerId) {
		var playerIndex = players.indexOf(playerId);
		players.splice(playerIndex, 1);
	};

	var getPlayers = function () {
		return players;
	};
	
	return {
		insertPlayer: insertPlayer,
		getPlayers: getPlayers,
		deletePlayer: deletePlayer
	};
}]);
