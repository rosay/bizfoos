app.controller('GameController', ['$scope', 'screenService', function($scope, screenService) {
	"use strict";

	var getCurrentScreen = function () {
		return screenService.getCurrentScreen();
	};

	screenService.getCurrentScreen();

	$scope.changeScreen = function (screenName) {
		screenService.setCurrentScreen(screenName);
	};

	$scope.title = "Game screen";

	$scope.showScreen = getCurrentScreen() == "game";

	$scope.changeScreen = function (screenName) {
		screenService.setCurrentScreen(screenName);
	};

	$scope.$on('screenChange', function(e, newScreen) {
		$scope.showScreen = getCurrentScreen() == "game";
	});
}]);

