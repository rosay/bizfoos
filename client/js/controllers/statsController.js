app.controller('StatsController', ['$http', 'statisticsService', 'playerService', function($http, statisticsService, playerService) {
    "use strict";

    var vm = this;

    vm.title = "Leaderboard";
    vm.playerRpi = [];
    vm.players = [];

    playerService.getPlayers()
        .then(function() {
            vm.players = playerService.players;

            statisticsService.getPlayerRpi()
                .then(function() {
                    var results = statisticsService.playerRpi;

                    var mergedList = _.map(results, function(item){
                        return _.extend(item, _.findWhere(playerService.players, { _id: item._id }));
                    });

                    for (var i = 0; i < mergedList.length; i++) {
                        var p = mergedList[i].RPI * 100;
                        mergedList[i].RPI = p.toFixed(2);

                        var p = mergedList[i].WP * 100;
                        mergedList[i].WP = p.toFixed(2)
                    }

                    vm.playerRpi = mergedList;
                });
        });
}]);
