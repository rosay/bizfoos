app.controller('LeaderboardController', ['$http', 'statisticsService', 'playerService', function($http, statisticsService, playerService) {
	"use strict";

	var vm = this;

	vm.title = "Leaderboard";
	vm.topWinners = [];
	vm.players = [];

	playerService.getPlayers()
		.then(function() {
			vm.players = playerService.players;

			statisticsService.getTopPlayers()
				.then(function() {
					var results = statisticsService.topPlayers;

					var mergedList = _.map(results, function(item){
						return _.extend(item, _.findWhere(playerService.players, { _id: item._id }));
					});

					for (var i = 0; i < mergedList.length; i++) {
						var p = mergedList[i].WinningPercentage * 100
						mergedList[i].WinningPercentage = p.toFixed(2);
					}

					vm.topWinners = mergedList;
				});
		});
}]);
