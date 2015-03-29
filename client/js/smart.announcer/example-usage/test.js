jQuery(function($) {

	var gameSettings = {
		"pointsNeededToWin": 5,
		"debug": true,
		//"skipIntro": true,
		
		"roster": {
			"teamBlack": {
				"offense": {
					"_id": "ahovingh@bizstream.com",
					"name": "Albert Hovingh",
					"nicknames": "Bert, Al, The Trash Man",
					"pic": ""
				},
				"defense": {
					"_id": "areece@bizstream.com",
					"name": "Adam Reece",
					"pic": ""
				}
			},
			"teamOrange": {
				"offense": {
					"_id": "mschmidt@bizstream.com",
					"name": "Mark Schmidt",
					"firstName": "Mark",
					"lastName": "Schmidt",
					"nicknames": "Schmidty",
					"pic": ""
				},
				"defense": {
					"_id": "sheibeck@bizstream.com",
					"name": "Sterling Heibeck",
					"nicknames": "The Ninja",
					"pic": ""
				}
			}
		}
		,teamNames: [{
			name: "The Avengers",
			players: ["sheibeck@bizstream.com", "mschmidt@bizstream.com"]
		},{
			name: "The Dream Team",
			players: ["areece@bizstream.com", "ahovingh@bizstream.com"]
		}] 

		/*
		"teams" : [
			{
				"color": "black",
				"team": "The Dream Team"
				//"probabilty": .80
			},
			{
				"color": "yellow",
				"team": "The Avengers"
				//"probabilty": .20
			}
		],
		"players" : [
			{	//0
				"playerid": "ahovingh@bizstream.com",
				"color": "black",
				"position": "o",
				"team": "The Dream Team",
				"names": [
					"Albert",
					"Bert",
					"Hovingh",
					"The Trash man"
				]
			},
			{	//1
				"playerid": "areece@bizstream.com",
				"color": "black",
				"position": "d",
				"team": "The Dream Team",
				"names": [
					"Adam",
					"Reece"
				]
			},
			{	//2
				"playerid": "mschmidt@bizstream.com",
				"color": "yellow",
				"position": "o",
				"team": "The Avengers",
				"names": [
					"Mark",
					"Schmidt",
					"Schmidty"
				]
			},
			{	//3
				"playerid": "sheibeck@bizstream.com",
				"color": "yellow",
				"position": "d",
				"team": "The Avengers",
				"names": [
					"Sterling",
					"Heibeck",
					//"The Sterl",
					"The Ninja"
				]
			}
		] // end array of peole
		*/
	};

	var gameSpeedSimulator = 1;// 5 times faster

	var gameSeconds = 0;
	var tmrGameClock = null;

	var $gameClock = $("#timeClock");

	var addToLog = function(msg) {
		var d = new Date()
		$("#log").append("<div>"+ d.toLocaleTimeString() +": "+ $gameClock.text() +": "+ msg +"</Div>");
	}

	$("#doVoiceTest").click(function() {
		smartAnnouncer.voiceTest();
	});

	$("#doMusicTest").click(function() {
		smartAnnouncer.musicTest();
	});

	$("#doRandomTest").click(function() {
		addToLog(smartAnnouncer.randomTest());
	});

	$("#doStringTest").click(function() {
		addToLog(smartAnnouncer.stringTest(gameSettings));
	});

	

	$("#stopGame").click(function() {
		smartAnnouncer.stop();
	});
	$("#newGame").click(function() {
		gameSeconds = 0;
		addToLog("New Game Started");
		smartAnnouncer.init(gameSettings); // end config, end initalize of SmartAnnouncer

		// start game clock
		clearInterval(tmrGameClock);
		tmrGameClock = setInterval(updateGameClock, 1000); // every second


	}); // end onclick event for new game


	var updateGameClock = function() {
		gameSeconds += (gameSpeedSimulator);
		min = Math.floor(gameSeconds/60);
		sec = gameSeconds - (min*60);
		if (sec < 10) sec = "0"+ sec;
		$gameClock.text(min+ ":"+ sec);
	} 


	$("button.player-score").click(function() {
		var $this = $(this);

		var oMessage = smartAnnouncer.scorePoint({
			"playerid":$this.attr("data-playerid"), 
			//"color": $this.attr("data-color"),
			//"position": $this.attr("data-position"),
			"power":  -42/* should be a number 0-9. -42 == random */
		})

		addToLog(oMessage.message);

	})


});