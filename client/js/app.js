(function() {
    "use strict";

	// App setup
	window.app = angular.module('app', ['ngRoute']);

	// Configure the app's routes
	window.app.config(['$routeProvider',
		function($routeProvider) {
			$routeProvider.
					when('/player', {
						templateUrl: 'partials/player.html',
						controller: 'PlayerController',
						controllerAs: 'ctrl'
					}).
					when('/game', {
						templateUrl: 'partials/game.html',
						controller: 'GameController',
						controllerAs: 'ctrl'
					}).
					when('/leaderboard', {
						templateUrl: 'partials/leaderboard.html',
						controller: 'LeaderboardController',
						controllerAs: 'ctrl'
					}).
					otherwise({
						redirectTo: '/player'
					});
		}
	])
}());