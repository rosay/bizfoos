app.directive('foosEnter', function(){
	return function(scope, element, attrs){
		element.bind("keydown keypress", function(event){
			if(event.which === 13){
				scope.$apply(function(){
					scope.ctrl.addPlayerToBullpen(scope.filteredPlayers[0]._id);
					scope.searchPlayers = '';
				});

				event.preventDefault();
			}
		});
	};
});