// Responsible handling the stats
app.factory('statisticsService', ['$rootScope', '$http', function statisticsService ($rootScope, $http) {
	"use strict";

	statisticsService.topPlayers = [];

	/**
	 * Server call to get all players from server.
	 * @returns {*}
	 */
	statisticsService.getTopPlayers = function () {
		return $http.get('/api/stats/topplayers')
			.success(function (data, status, headers, config) {
				statisticsService.topPlayers = data;
			})
			.error(function (data, status, headers, config) {
				console.log("No players showed up! Status: " + status);
			});
	};

	return statisticsService;

}]);
