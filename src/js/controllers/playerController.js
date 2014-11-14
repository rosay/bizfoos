app.controller('PlayerController', ['$scope', '$http', 'screenService', function($scope, $http, screenService) {
	"use strict";

	var getCurrentScreen = function () {
		return screenService.getCurrentScreen();
	};

	// Gets player data
	$http({method: 'GET', url: 'FakeData/players.json'}).
		success(function (data, status, headers, config) {
			$scope.players = data;
		}).
		error(function (data, status, headers, config) {
			console.log("Could not get players!");
		});

	$scope.title = "Player list";
	$scope.showScreen = getCurrentScreen() == "player";

	$scope.changeScreen = function (screenName) {
		screenService.setCurrentScreen(screenName);
	};

	$scope.$on('screenChange', function(e, newScreen) {
		$scope.showScreen = getCurrentScreen() == "player";
	});

}]);

