var a;
app.controller('GameController', ['gameService', 'rosterService', 'playerService', '$location','$document', '$scope', '$interval', function(gameService, rosterService, playerService, $location, $document, $scope, $interval) {
	"use strict";

	var vm = this;

	vm.smartAnnouncer;

	gameService.checkGameReady();

	vm.rematchCount = 0;

	vm.title = "Let's play!";
	vm.scores = { 1: gameService.getScoresCount(1), 2: gameService.getScoresCount(2) };
	vm.gameOver = gameService.isGameOver();
	var timePlayed = 0;
	var clock = null;
	vm.gameClock = "0:00";


	rosterService.createRoster();

	vm.players = {
		"teamBlack": {
		"offense": {
			"name": "",
				"id": "",
				"pic": ""
		},
		"defense": {
			"name": "",
				"id": "",
				"pic": ""
		}
		},
			"teamOrange": {
			"offense": {
				"name": "",
					"id": "",
					"pic": ""
			},
			"defense": {
				"name": "",
					"id": "",
					"pic": ""
			}
		}
	};

	var setPlayers = function () {
		vm.players.teamBlack.offense = rosterService.getPlayer(1, "offense");
		vm.players.teamBlack.defense = rosterService.getPlayer(1, "defense");

		vm.players.teamOrange.offense = rosterService.getPlayer(2, "offense");
		vm.players.teamOrange.defense = rosterService.getPlayer(2, "defense");
	};

	setPlayers();

	// intialize the smart announcer everytime a game starts
	vm.smartAnnouncer = new SmartAnnouncer({
			"pointsNeededToWin": 5,
			//"debug": true,
			"teams" : [
				{
					"color": "black",
					"team": "The Black Team" // eventually Team names: The Dream Team
					//"probabilty": .80
				},
				{
					"color": "yellow",
					"team": "The Yellow Team" // eventually team names: The Avengers
					//"probabilty": .20
				}
			],
			"players" : [
				{	//0
					"playerid": vm.players.teamBlack.offense.playerId,
					"color": "black",
					"position": "o",
					"team": "The Black Team",
					"names": [
						vm.players.teamBlack.offense.firstName,
						vm.players.teamBlack.offense.lastName
						// eventually nicknames
						//"Bert", 
						//"The Trash man"
					]
				},
				{	//1
					"playerid": vm.players.teamBlack.defense.playerId,
					"color": "black",
					"position": "d",
					"team": "The Dream Team",
					"names": [
						vm.players.teamBlack.defense.firstName,
						vm.players.teamBlack.defense.lastName
						// eventually nicknames
						//"Adam",
						//"Reece"
					]
				},
				{	//2
					"playerid": vm.players.teamOrange.offense.playerId,
					"color": "yellow",
					"position": "o",
					"team": "The Avengers",
					"names": [
						vm.players.teamOrange.offense.firstName,
						vm.players.teamOrange.offense.lastName
						// eventually nicknames
						//"Mark",
						//"Schmidt",
						//"Schmidty"
					]
				},
				{	//3
					"playerid": vm.players.teamOrange.defense.playerId,
					"color": "yellow",
					"position": "d",
					"team": "The Avengers",
					"names": [
						vm.players.teamOrange.defense.firstName,
						vm.players.teamOrange.defense.lastName
						// eventually nicknames
						//"Sterling",
						//"Heibeck",
						//"The Sterl",
						//"The Ninja"
					]
				}
			] // end array of peole
		}); // end config, end initalize of SmartAnnouncer


	gameService.setStartTime();

	var startClock = function () {
		vm.gameClock = "0:00";
		timePlayed = 0;

		clock = $interval(function() {
			timePlayed++;
			var min = Math.floor(timePlayed / 60);
			var sec = timePlayed % 60 > 9 ? timePlayed % 60 : "0" + timePlayed % 60;

			vm.gameClock = min + ":" + sec;
		}, 1000);
	};

	startClock();

	vm.addScore = function(playerId) {

		gameService.addScore(playerId);
		vm.scores[1] = gameService.getScoresCount(1);
		vm.scores[2] = gameService.getScoresCount(2);
		vm.gameOver = gameService.isGameOver();

		// Sound Effects
		var sound;
		if(!vm.gameOver){
			sound = new Audio(vm.scoreEffect());
		}else{
			sound = new Audio('sounds/win.mp3');
			$interval.cancel(clock);
		}
		sound.play();

		// let the game announcer know a point was scored
		var oMessage = smartAnnouncer.ScorePoint({
			"playerid": playerId, 
			"power":  -42 /* should be a number 0-9. -42 == random */
		})
	};

	vm.removeLastScore = function() {
		gameService.removeLastScore();
		vm.scores[1] = gameService.getScoresCount(1);
		vm.scores[2] = gameService.getScoresCount(2);
		vm.gameOver = gameService.isGameOver();
	};

	vm.startNewGame = function() {
		playerService.clearBullpen();
		rosterService.clearRoster();
		gameService.clearScores();
		$location.path('/player');
	};

	vm.keepWinners = function() {
		var losers = gameService.getLoserPlayerIds();
		var winningTeam = gameService.getWinningTeam();
		var losingTeam = gameService.getLosingTeam();

		rosterService.swapTeamPositions(winningTeam);

		playerService.clearLosersFromBullpen(losers);

		rosterService.clearTeamFromRoster(losingTeam);
		rosterService.swapTeams();

		$location.path('/player');

		gameService.clearScores();
	};

	vm.swapTeamPositions = function (teamNum) {
		rosterService.swapTeamPositions(teamNum);

		setPlayers();
	};

	vm.rematch = function() {
		// Swap players positions
		rosterService.swapPositions();

		// Swap teams
		rosterService.swapTeams();

		// start new game
		gameService.clearScores();
		vm.scores[1] = gameService.getScoresCount(1);
		vm.scores[2] = gameService.getScoresCount(2);

		setPlayers();

		vm.gameOver = false;

		vm.rematchCount += 1;
		startClock();
		vm.startEffect();
	};

	vm.scoreEffect = function(){
		return 'sounds/score-' + (Math.floor(Math.random() * 5) + 1 )+ '.mp3';
	};

	$document.unbind('keypress').bind('keypress', function(event){

		var kc = event.keyCode;

		$scope.$apply(function(){
			if(kc === 113){ // Keypress "q" for Orange D 
				vm.addScore(vm.players.teamOrange.defense._id);
			}else if(kc === 97){ // Keypress "a" for Orange O
				vm.addScore(vm.players.teamOrange.offense._id);
			}else if(kc === 119){ // Keypress "w" for Black O
				vm.addScore(vm.players.teamBlack.offense._id);
			}else if(kc === 115){ // Keypress "s" for Black D
				vm.addScore(vm.players.teamBlack.defense._id);
			}
		});
		
	});

	vm.startEffect = function(){
		var audio = new Audio('sounds/start.mp3');
		audio.play();
	};

	vm.startEffect();

}]);

