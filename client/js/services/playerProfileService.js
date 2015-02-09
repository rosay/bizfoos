/**
* Handles everything to do with the individual player profiles.
*/
app.factory('playerProfileService', ['$http', function playerProfileService ($http) {
	"use strict";

	var stats;


	var getStats = function(username){
		return $http.get('/api/stats/players/' + username)
				.success(function (data, status, headers, config){
					stats = data[0];
					console.log(stats)
				})
				.error(function(data, status, headers, config){
					console.log("Error on stats retrieval for " + username);
				});
	};

	var retrieve = function(){
		return stats;
	}

	return {
		getStats: getStats,
		stats: stats,
		retrieve: retrieve
	}
}]);
