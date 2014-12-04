(function() {
    "use strict";
	window.app = angular.module('app', ['ngRoute']);

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
						controllerAs: 'game'
					}).
					when('/leaderboard', {
						templateUrl: 'partials/leaderboard.html',
						controller: 'LeaderboardController',
						controllerAs: 'leaderboard'
					}).
					otherwise({
						redirectTo: '/player'
					});


		}
	])
}());
