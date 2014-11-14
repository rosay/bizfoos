// Responsible handling the current screen
app.factory('screenService', ['$rootScope', function ($rootScope) {
	"use strict";

	// set default to player screen
	var currentScreen = "player";

	var getCurrentScreen = function () {
		return currentScreen;
	};

	var setCurrentScreen = function (newScreen) {
		currentScreen = newScreen;
		// Let everyone else know the map type has changed.
		$rootScope.$broadcast('screenChange', currentScreen);
	};


	return {
		getCurrentScreen: getCurrentScreen,
		setCurrentScreen: setCurrentScreen
	}

}]);
