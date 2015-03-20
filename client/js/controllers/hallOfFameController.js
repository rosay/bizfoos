app.controller('HallOfFameController', ['$http', 'statisticsService', function($http, statisticsService) {
    "use strict";

    var vm = this;

    vm.title = "Hall of Fame";
    vm.playerRpi = [];
    vm.players = [];
    vm.minGames = 10;

    statisticsService.getPlayerRpi()
        .then(function() {
            var players = statisticsService.playerRpi;

            players = players.filter(function (player) {
                return player.TotalGames >= vm.minGames && player.name.indexOf("Guest") === -1;
            });

            for (var i = 0; i < players.length; i++) {
                players[i].WP = (players[i].WP * 100).toFixed(2);
            }

            vm.playerRpi = players;
        });
}]);
