app.controller('LeaderboardController', ['$scope', '$http', function($scope, $http) {
	"use strict";

	$scope.title = "Leaderboard";
	$scope.topWinners = [];

	// Gets player data
	$http({method: 'POST', url: 'http://localhost:3000/api/lb/topplayers'}).
			success(function (data, status, headers, config) {
				$scope.topWinners = data;
			}).
			error(function (data, status, headers, config) {
				console.log("No players showed up! Status: " + status);
			});
}]);
