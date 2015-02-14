app.controller('PlayerProfileController', ['playerProfileService', '$timeout', '$routeParams', '$location', function (playerProfileService, $timeout, $routeParams, $location) {
	"use strict";

	var vm = this;
	vm.stats = [];

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
            vm.stats.push({ title: "Total Game Time", value: getEnglishDuration(dbPlayer.TotalGameTime)});
            vm.stats.push({ title: "Winning Percentage", value: (dbPlayer.WinningPercentage * 100).toFixed(2) });
            vm.stats.push({ title: "Total Games Played", value: dbPlayer.TotalGamesPlayed});
            vm.stats.push({ title: "Total Games Won", value: dbPlayer.TotalGamesWon});
            vm.stats.push({ title: "Total Games Lost", value: dbPlayer.TotalGamesLost});
            vm.stats.push({ title: "Total Games Won On Defense", value: dbPlayer.TotalGamesWonOnDefense});
            vm.stats.push({ title: "Total Games Won On Offense", value: dbPlayer.TotalGamesWonOnOffense});
            vm.stats.push({ title: "Total Offensive Game Time", value: getEnglishDuration(dbPlayer.TotalOffensiveGameTime)});
            vm.stats.push({ title: "Total Offensive Points", value: dbPlayer.TotalOffensivePoints});
            vm.stats.push({ title: "Total Points", value: dbPlayer.TotalPoints});
            vm.stats.push({ title: "Average Defensive Game Time", value: getEnglishDuration(dbPlayer.AverageDefensiveGameTime)});
            vm.stats.push({ title: "Average Defensive Game Time After Loss", value: getEnglishDuration(dbPlayer.AverageDefensiveGameTimeAfterLoss)});
            vm.stats.push({ title: "Average Defensive Game Time After Win", value: getEnglishDuration(dbPlayer.AverageDefensiveGameTimeAfterWin)});
            vm.stats.push({ title: "Average Defensive Points Per Game", value: dbPlayer.AverageDefensivePointsPerGame});
            vm.stats.push({ title: "Average Game Time", value: getEnglishDuration(dbPlayer.AverageGameTime)});
            vm.stats.push({ title: "Average Offensive Game Time", value: getEnglishDuration(dbPlayer.AverageOffensiveGameTime)});
            vm.stats.push({ title: "Average Offensive GameTime After Loss", value: getEnglishDuration(dbPlayer.AverageOffensiveGameTimeAfterLoss)});
            vm.stats.push({ title: "Average Offensive Game Time After Win", value: getEnglishDuration(dbPlayer.AverageOffensiveGameTimeAfterWin)});
            vm.stats.push({ title: "Average Offensive Points Per Game", value: dbPlayer.AverageOffensivePointsPerGame});
            vm.stats.push({ title: "Average Points Per Game", value: dbPlayer.AveragePointsPerGame});
            vm.stats.push({ title: "Longest Game", value: getEnglishDuration(dbPlayer.LongestGame)});
            vm.stats.push({ title: "Longest Game After Loss On Defense", value: getEnglishDuration(dbPlayer.LongestGameAfterLossOnDefense)});
            vm.stats.push({ title: "Longest Game After Loss On Offense", value: getEnglishDuration(dbPlayer.LongestGameAfterLossOnOffense)});
            vm.stats.push({ title: "Longest Game After Win On Defense", value: getEnglishDuration(dbPlayer.LongestGameAfterWinOnDefense)});
            vm.stats.push({ title: "Longest Game After Win On Offense", value: getEnglishDuration(dbPlayer.LongestGameAfterWinOnOffense)});
            vm.stats.push({ title: "Longest Game On Defense", value: getEnglishDuration(dbPlayer.LongestGameOnDefense)});
            vm.stats.push({ title: "Longest Game On Offense", value: getEnglishDuration(dbPlayer.LongestGameOnOffense)});
            vm.stats.push({ title: "Shortest Game", value: getEnglishDuration(dbPlayer.ShortestGame)});
            vm.stats.push({ title: "Shortest Game After Loss On Defense", value: getEnglishDuration(dbPlayer.ShortestGameAfterLossOnDefense)});
            vm.stats.push({ title: "Shortest Game After Loss On Offense", value: getEnglishDuration(dbPlayer.ShortestGameAfterLossOnOffense)});
            vm.stats.push({ title: "Shortest Game After Win On Defense", value: getEnglishDuration(dbPlayer.ShortestGameAfterWinOnDefense)});
            vm.stats.push({ title: "Shortest Game After Win On Offense", value: getEnglishDuration(dbPlayer.ShortestGameAfterWinOnOffense)});
            vm.stats.push({ title: "Shortest Game On Defense", value: getEnglishDuration(dbPlayer.ShortestGameOnDefense)});
            vm.stats.push({ title: "Shortest Game On Offense", value: getEnglishDuration(dbPlayer.ShortestGameOnOffense)});
            vm.stats.push({ title: "Total Defensive Game Time", value: getEnglishDuration(dbPlayer.TotalDefensiveGameTime)});
            vm.stats.push({ title: "Total Defensive Points", value: dbPlayer.TotalDefensivePoints});
            vm.stats.push({ title: "Total Games Lost On Defense", value: dbPlayer.TotalGamesLostOnDefense});
            vm.stats.push({ title: "Total Games Lost On Offense", value: dbPlayer.TotalGamesLostOnOffense});
            vm.stats.push({ title: "Total Games On Defense", value: dbPlayer.TotalGamesOnDefense});
            vm.stats.push({ title: "Total Games On Offense", value: dbPlayer.TotalGamesOnOffense});

            vm.playerid = dbPlayer._id;
		});
}]);