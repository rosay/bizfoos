app.controller('LeaderboardController', ['$http', 'statisticsService', function($http, statisticsService) {
    "use strict";

    var vm = this,
        lastNDays = 7;

    vm.title = "Leaderboard";
    vm.playerRpi = [];
    vm.players = [];

    statisticsService.getPlayerRpi(lastNDays)
        .then(function() {
            var results = statisticsService.playerRpi;

            for (var i = 0; i < results.length; i++) {
                results[i].WP = (results[i].WP * 100).toFixed(2);
            }

            vm.playerRpi = results;
        });
}]);
