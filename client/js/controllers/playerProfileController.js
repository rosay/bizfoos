app.controller('PlayerProfileController', ['playerProfileService', '$timeout', '$routeParams', '$location', function (playerProfileService, $timeout, $routeParams, $location) {
	"use strict";

	var vm = this;
	vm.player = {};

	
	playerProfileService.getStats($routeParams.id)
		.then(function(){
			vm.player = playerProfileService.retrieve();
		})
		.then(function(){
			if(!vm.player){
				$location.path('/player');
			}
		});

}]);