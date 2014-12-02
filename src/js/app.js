(function() {
    "use strict";
	window.app = angular.module('app', ['ngRoute']);

	window.app.config(['$routeProvider',
		function($routeProvider) {
			$routeProvider.
					when('/player', {
						templateUrl: 'partials/player.html',
						controller: 'PlayerController'
					}).
					when('/game', {
						templateUrl: 'partials/game.html',
						controller: 'GameController'
					}).
					when('/leaderboard', {
						templateUrl: 'partials/leaderboard.html',
						controller: 'LeaderboardController'
					}).
					otherwise({
						redirectTo: '/player'
					});


		}
	])
}());
