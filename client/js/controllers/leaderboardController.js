app.controller('LeaderboardController', ['$http', 'statisticsService', function($http, statisticsService) {
    "use strict";

    var vm = this,
        weeksAgo = 0;

    vm.title = "Leaderboard";
    vm.playerRpi = [];
    vm.players = [];
    vm.minGames = 3;

    vm.updateWeekButtons = function () {
        vm.showPreviousWeek = true;
        vm.showNextWeek = moment().add(weeksAgo + 1,'week').startOf('week').diff(moment()) < 0;
    };

    var getDateRange = function () {
        vm.updateWeekButtons();

        var fromDate = getFromDate();
        var toDate = getToDate();

        return { fromDate: fromDate, toDate: toDate };
    };

    var getFromDate = function () {
        return moment().add(weeksAgo,'weeks').startOf('week').toDate();
    };

    var getToDate = function () {
        return moment().add(weeksAgo,'weeks').endOf('week').toDate();
    };

    var getFormattedTimeSpan = function () {
        return moment(getFromDate()).format("MMM Do") + " to " + moment(getToDate()).format("MMM Do");
    };

    var getPlayerRpi = function () {
        statisticsService.getPlayerRpi(getDateRange())
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
    };

    vm.onWeekChange = function (n) {
        weeksAgo = weeksAgo + n;

        ctrlSetup();
    };

    var ctrlSetup = function () {
        getPlayerRpi();
        vm.timeSpan = getFormattedTimeSpan();
        vm.updateWeekButtons();
    };

    // Setup
    ctrlSetup();
}]);
