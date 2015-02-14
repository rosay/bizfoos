app.controller('HallOfFameController', ['$http', 'statisticsService', function($http, statisticsService) {
    "use strict";

    var vm = this;

    vm.title = "Hall of Fame";
    vm.playerRpi = [];
    vm.players = [];
    vm.minGames = 10;

    statisticsService.getPlayerRpi()
        .then(function() {
            var results = statisticsService.playerRpi;

            for (var i = 0; i < results.length; i++) {
                results[i].WP = (results[i].WP * 100).toFixed(2);
            }

            vm.playerRpi = results;
        });
}]);
