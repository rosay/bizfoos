// Responsible handling the current screen
app.factory('gameService', ['$rootScope', function ($rootScope) {
	"use strict";

	// store players in the game
	var players = [];

	var insertPlayer = function (newPlayer) {

		var isInGame = players.some(function(player){
			return newPlayer._id === player._id;
		});

		if (!isInGame &&  players.length < 4) {
			players.push(newPlayer);

			return true;
		}

		return false;
	};

	var deletePlayer = function (playerId) {
		// Get the player object from the array of players
		var playerIndex = _.findIndex(players, {"_id" : playerId});

		var deletedPlayer = players.splice(playerIndex, 1)[0];

		return deletedPlayer;
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
