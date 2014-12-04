app.factory('rosterService', ['gameService', 'playerService', function (gameService, playerService) {

	// store players in the game
	// Array of objects: { player_id: "mark@bizstream.com" team: 1, position: "offense" }
	var roster = [];

	// Teams and positions get merged with roster
	var teamsAndPositions = [
		{ team: 1, position: "offense" },
		{ team: 1, position: "defense" },
		{ team: 2, position: "offense" },
		{ team: 2, position: "defense" }
	];

	// Used to put players on random teams and positions
	var shuffle = function (array) {
		var currentIndex = array.length, temporaryValue, randomIndex;

		// While there remain elements to shuffle...
		while (0 !== currentIndex) {

			// Pick a remaining element...
			randomIndex = Math.floor(Math.random() * currentIndex);
			currentIndex -= 1;

			// And swap it with the current element.
			temporaryValue = array[currentIndex];
			array[currentIndex] = array[randomIndex];
			array[randomIndex] = temporaryValue;
		}

		return array;
	};

	var createGameRoster = function () {
		if (roster.length === 0) {
			// Combine
			roster = _.where(playerService.players, { 'inBullpen': true }) ;
			_.merge(shuffle(roster), teamsAndPositions);
		}
	};

	var getTeamByPlayerId = function(playerId) {
		if (roster.length) {
			var playerIndex = _.findIndex(roster, {"_id" : playerId});
			var player = roster[playerIndex];

			return player.team;
		}

		return 0;
	};

	return {
		createGameRoster: createGameRoster,
		getTeamByPlayerId: getTeamByPlayerId,
		roster: roster
	};
}]);
