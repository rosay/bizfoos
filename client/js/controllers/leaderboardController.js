app.controller('LeaderboardController', ['$http', 'statisticsService', function($http, statisticsService) {
    "use strict";

    var vm = this,
        startOfWeek = moment().utc().startOf('week').toDate();

    vm.title = "Leaderboard";
    vm.playerRpi = [];
    vm.players = [];
    vm.minGames = 3;

    statisticsService.getPlayerRpi(startOfWeek)
        .then(function() {
            var players = statisticsService.playerRpi;

            players = players.filter(function (player) {
                return player.TotalGames > vm.minGames;
            });

            for (var i = 0; i < players.length; i++) {
                players[i].WP = (players[i].WP * 100).toFixed(2);
            }

            vm.playerRpi = players;
        });
}]);
