app.controller('PlayerProfileController', ['playerProfileService', '$timeout', '$routeParams', '$location', function (playerProfileService, $timeout, $routeParams, $location) {
	"use strict";

	var vm = this;
	vm.player = {};

    var getEnglishDuration = function(duration) {
        var str = "";

        _.forOwnRight(duration, function(value, key) {
            if (value > 0 && key != "millis") {
                str = str + (value + " " + key + " ");
            }
        });

        return str;
    };

	playerProfileService.getStats($routeParams.id)
		.then(function(){
			var dbPlayer = playerProfileService.retrieve();
            vm.player.TotalGameTime = { title: "Total Game Time", value: getEnglishDuration(dbPlayer.TotalGameTime)};
            vm.player.WinningPercentage = { title: "Winning Percentage", value: (dbPlayer.WinningPercentage * 100).toFixed(2) };
            vm.player.TotalGamesPlayed = { title: "Total Games Played", value: dbPlayer.TotalGamesPlayed};
            vm.player.TotalGamesWon = { title: "Total Games Won", value: dbPlayer.TotalGamesWon};
            vm.player.TotalGamesLost = { title: "Total Games Lost", value: dbPlayer.TotalGamesLost};
            vm.player.TotalGamesWonOnDefense = { title: "Total Games Won On Defense", value: dbPlayer.TotalGamesWonOnDefense};
            vm.player.TotalGamesWonOnOffense = { title: "Total Games Won On Offense", value: dbPlayer.TotalGamesWonOnOffense};
            vm.player.TotalOffensiveGameTime = { title: "Total Offensive Game Time", value: getEnglishDuration(dbPlayer.TotalOffensiveGameTime)};
            vm.player.TotalOffensivePoints = { title: "Total Offensive Points", value: dbPlayer.TotalOffensivePoints};
            vm.player.TotalPoints = { title: "Total Points", value: dbPlayer.TotalPoints};
            vm.player.AverageDefensiveGameTime = { title: "Average Defensive Game Time", value: getEnglishDuration(dbPlayer.AverageDefensiveGameTime)};
            vm.player.AverageDefensiveGameTimeAfterLoss = { title: "Average Defensive Game Time After Loss", value: getEnglishDuration(dbPlayer.AverageDefensiveGameTimeAfterLoss)};
            vm.player.AverageDefensiveGameTimeAfterWin = { title: "Average Defensive Game Time After Win", value: getEnglishDuration(dbPlayer.AverageDefensiveGameTimeAfterWin)};
            vm.player.AverageDefensivePointsPerGame = { title: "Average Defensive Points Per Game", value: dbPlayer.AverageDefensivePointsPerGame};
            vm.player.AverageGameTime = { title: "Average Game Time", value: getEnglishDuration(dbPlayer.AverageGameTime)};
            vm.player.AverageOffensiveGameTime = { title: "Average Offensive Game Time", value: getEnglishDuration(dbPlayer.AverageOffensiveGameTime)};
            vm.player.AverageOffensiveGameTimeAfterLoss = { title: "Average Offensive GameTime After Loss", value: getEnglishDuration(dbPlayer.AverageOffensiveGameTimeAfterLoss)};
            vm.player.AverageOffensiveGameTimeAfterWin = { title: "Average Offensive Game Time After Win", value: getEnglishDuration(dbPlayer.AverageOffensiveGameTimeAfterWin)};
            vm.player.AverageOffensivePointsPerGame = { title: "Average Offensive Points Per Game", value: dbPlayer.AverageOffensivePointsPerGame};
            vm.player.AveragePointsPerGame = { title: "Average Points Per Game", value: dbPlayer.AveragePointsPerGame};
            vm.player.LongestGame = { title: "Longest Game", value: getEnglishDuration(dbPlayer.LongestGame)};
            vm.player.LongestGameAfterLossOnDefense = { title: "Longest Game After Loss On Defense", value: getEnglishDuration(dbPlayer.LongestGameAfterLossOnDefense)};
            vm.player.LongestGameAfterLossOnOffense = { title: "Longest Game After Loss On Offense", value: getEnglishDuration(dbPlayer.LongestGameAfterLossOnOffense)};
            vm.player.LongestGameAfterWinOnDefense = { title: "Longest Game After Win On Defense", value: getEnglishDuration(dbPlayer.LongestGameAfterWinOnDefense)};
            vm.player.LongestGameAfterWinOnOffense = { title: "Longest Game After Win On Offense", value: getEnglishDuration(dbPlayer.LongestGameAfterWinOnOffense)};
            vm.player.LongestGameOnDefense = { title: "Longest Game On Defense", value: getEnglishDuration(dbPlayer.LongestGameOnDefense)};
            vm.player.LongestGameOnOffense = { title: "Longest Game On Offense", value: getEnglishDuration(dbPlayer.LongestGameOnOffense)};
            vm.player.ShortestGame = { title: "Shortest Game", value: getEnglishDuration(dbPlayer.ShortestGame)};
            vm.player.ShortestGameAfterLossOnDefense = { title: "Shortest Game After Loss On Defense", value: getEnglishDuration(dbPlayer.ShortestGameAfterLossOnDefense)};
            vm.player.ShortestGameAfterLossOnOffense = { title: "Shortest Game After Loss On Offense", value: getEnglishDuration(dbPlayer.ShortestGameAfterLossOnOffense)};
            vm.player.ShortestGameAfterWinOnDefense = { title: "Shortest Game After Win On Defense", value: getEnglishDuration(dbPlayer.ShortestGameAfterWinOnDefense)};
            vm.player.ShortestGameAfterWinOnOffense = { title: "Shortest Game After Win On Offense", value: getEnglishDuration(dbPlayer.ShortestGameAfterWinOnOffense)};
            vm.player.ShortestGameOnDefense = { title: "Shortest Game On Defense", value: getEnglishDuration(dbPlayer.ShortestGameOnDefense)};
            vm.player.ShortestGameOnOffense = { title: "Shortest Game On Offense", value: getEnglishDuration(dbPlayer.ShortestGameOnOffense)};
            vm.player.TotalDefensiveGameTime = { title: "Total Defensive Game Time", value: getEnglishDuration(dbPlayer.TotalDefensiveGameTime)};
            vm.player.TotalDefensivePoints = { title: "Total Defensive Points", value: dbPlayer.TotalDefensivePoints};
            vm.player.TotalGamesLostOnDefense = { title: "Total Games Lost On Defense", value: dbPlayer.TotalGamesLostOnDefense};
            vm.player.TotalGamesLostOnOffense = { title: "Total Games Lost On Offense", value: dbPlayer.TotalGamesLostOnOffense};
            vm.player.TotalGamesOnDefense = { title: "Total Games On Defense", value: dbPlayer.TotalGamesOnDefense};
            vm.player.TotalGamesOnOffense = { title: "Total Games On Offense", value: dbPlayer.TotalGamesOnOffense};

            vm.playerid = dbPlayer._id;
		})
		.then(function(){
			if(!vm.player){
				$location.path('/player');
			}
		});
}]);