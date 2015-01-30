// Responsible handling the stats
app.factory('statisticsService', ['$rootScope', '$http', function statisticsService ($rootScope, $http) {
	"use strict";

	statisticsService.topPlayers = [];
	statisticsService.playerRpi = [];

	/**
	 * Gets basic player stats
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

	/**
	 * Gets player RPI
	 * @returns {*}
	 */
	statisticsService.getPlayerRpi = function (lastNDays) {
		return $http.post('/api/stats/rpi', { "fromDays": lastNDays })
			.success(function (data, status, headers, config) {
				statisticsService.playerRpi = data;
			})
			.error(function (data, status, headers, config) {
				console.log("No players showed up! Status: " + status);
			});
	};

	return statisticsService;
}]);
