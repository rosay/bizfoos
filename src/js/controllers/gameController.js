app.controller('GameController', ['$scope', 'gameService', function($scope, gameService) {
	"use strict";

	// TODO refactor controller by removing all business logic: http://toddmotto.com/rethinking-angular-js-controllers/

	var shufflePlayers = function (array) {
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

	var getTeamByPlayer = function(playerId) {
		var playerIndex = _.findIndex($scope.players, {"_id" : playerId});
		var player = $scope.players[playerIndex];

		return player.team;
	};

	var gamePlayers = shufflePlayers(gameService.getPlayers());

	var teamsAndPositions = [
		{ team: 1, position: "offense" },
		{ team: 1, position: "defense" },
		{ team: 2, position: "offense" },
		{ team: 2, position: "defense" }
	];

	$scope.players = _.merge(gamePlayers, teamsAndPositions);
	$scope.title = "Game screen";
	$scope.scores = { 1: 0, 2: 0 };
	$scope.gameOver = false;

	$scope.addScore = function(playerId, teamNum) {
		gameService.addScore(playerId);

		$scope.scores[teamNum] += 1;

		if ($scope.scores[teamNum] === 5) {
			$scope.gameOver = true;
		}
	};

	$scope.removeLastScore = function() {
		var removedScore = gameService.removeLastScore();

		if (removedScore.length) {
			var teamNum = getTeamByPlayer(removedScore[0].player_id);

			$scope.scores[teamNum] -= 1;

			if ($scope.scores[teamNum] < 5) {
				$scope.gameOver = false;
			}
		}
	};
}]);

