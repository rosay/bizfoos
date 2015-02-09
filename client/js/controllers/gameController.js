var a;
app.controller('GameController', ['gameService', 'rosterService', 'playerService', 'configService', 'announcerService', '$location','$document', '$scope', '$interval', function(gameService, rosterService, playerService, configService, announcerService, $location, $document, $scope, $interval) {
	"use strict";

	var vm = this;

	vm.title = "Let's play!";
	vm.scores = { 1: 0, 2: 0 };
	vm.gameOver = false;
	vm.rematchCount = 0;
	var timePlayed = 0;
	var clock = null;
	vm.gameClock = "0:00";
    vm.players = {
        "teamBlack": {
            "offense": {},
            "defense": {}
        },
        "teamOrange": {
            "offense": {},
            "defense": {}
        }
    };

	var setPlayers = function () {
		vm.players.teamBlack.offense = rosterService.getPlayer(1, "offense");
		vm.players.teamBlack.defense = rosterService.getPlayer(1, "defense");

		vm.players.teamOrange.offense = rosterService.getPlayer(2, "offense");
		vm.players.teamOrange.defense = rosterService.getPlayer(2, "defense");
	};

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
		//sound.play();
	};

	vm.swapTeamPositions = function (teamNum) {
		rosterService.swapTeamPositions(teamNum);

		setPlayers();
	};

	vm.removeLastScore = function() {
		gameService.removeLastScore();
		vm.scores[1] = gameService.getScoresCount(1);
		vm.scores[2] = gameService.getScoresCount(2);
		vm.gameOver = gameService.isGameOver();
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

	vm.scoreEffect = function(){
		return 'sounds/score-' + (Math.floor(Math.random() * 5) + 1 )+ '.mp3';
	};

	vm.startEffect = function(){
		var audio = new Audio('sounds/start.mp3');
		audio.play();
	};

	vm.startAnnounce = function(){
		var rosterClone = _.cloneDeep(vm.players);

		// intialize the smart announcer everytime a game starts
		announcerService.init({
			"pointsNeededToWin": configService.getScoreLimit(),
			"roster" : rosterClone,
			"useTTS": true,
			"debug": false,

		});
	};

	vm.newGameButton = function() {
		playerService.clearBullpen();
		rosterService.clearRoster();
		gameService.clearScores();
		$location.path('/player');
	};

	vm.keepWinnersButton = function() {
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

	vm.rematchButton = function() {
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
		vm.startAnnounce();
	};

	if (gameService.isGameReady()) {
		rosterService.createRoster();

		setPlayers();

		gameService.setStartTime();

		startClock();

		vm.startAnnounce();
		vm.startEffect();
	} else {
		$location.path( "/players" );
	}

}]);

