app.controller('StatsController', ['$http', 'statisticsService', function($http, statisticsService) {
    "use strict";

    var vm = this;

    vm.title = "Leaderboard";
    vm.playerRpi = [];
    vm.players = [];

    statisticsService.getPlayerRpi()
        .then(function() {
            var results = statisticsService.playerRpi;

            for (var i = 0; i < results.length; i++) {
                results[i].WP = (results[i].WP * 100).toFixed(2);
            }

            vm.playerRpi = results;
        });
}]);
