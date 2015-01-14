/**
* Handles everything to do with the configuration of the game.
*/
app.factory('configService', [ function configService () {
	"use strict";

	var scoreLimit = 5;

	var setScoreLimit = function(amount){
		scoreLimit = amount;
		return scoreLimit;
	}

	var getScoreLimit = function(){
		return scoreLimit;
	}


	return {
		setScoreLimit: setScoreLimit,
		getScoreLimit: getScoreLimit
	}
}]);