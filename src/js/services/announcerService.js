// TO DO
// player Gender
// player NickNames
// Team Names

app.factory('announcerService', [ function announcerService () {
	"use strict";

	var soundRootPath = "sounds/"
	if (window.location.protocol == "file:") soundRootPath = "../../../sounds/";
		
	var config = {
		"pointsNeededToWin": 5,
		"series:": 1,
		"useTTS": true,
		"debug": false
	};

	var weather = {
		condition: "",
		temperature: 42,
		wind: 42
	}

	var tmrGameUpdates = null; // just a timer/interval that we can turn on or off if needed

	var crowdControl = {
		audioElement : null,
		audioApplause : null,
		startCrowd: function() {
			var crowd = getSoundFile("crowd");
			if ($("#bgAudio").length == 0) {
				$("body").append('<audio id="bgAudio" loop="loop" src="'+ crowd +'"></audio>')
			}
			crowdControl.audioElement = document.getElementById("bgAudio");
			crowdControl.audioElement.volume = .05;
			crowdControl.audioElement.play();
		},
		playApplause: function(soundType, volumeLevel) {
			crowdControl.audioApplause = new Audio(getSoundFile(soundType));
			crowdControl.audioApplause.volume = crowdControl.ensureSafeVolume(volumeLevel, crowdControl.audioElement.volume); // volumeLevel
			crowdControl.audioApplause.play();
		},
		ensureSafeVolume: function(level, min) {
			if (level < min) level = min;
			if (level > 1) level = 1;
			return level
		},
		getVolume: function() { return crowdControl.audioElement.volume; },
		setVolume: function(level) {
		    debug("crowdControl.audioElement.volume:pre  = "+ crowdControl.audioElement.volume);
		    crowdControl.audioElement.volume = crowdControl.ensureSafeVolume(level, .05);
		    debug("crowdControl.audioElement.volume:post = "+ crowdControl.audioElement.volume);
		},
		adjustVolume: function(changeBy) {
			var changeTo = crowdControl.audioElement.volume + changeBy;
		 	debug("adjustVolume "+ changeBy + " == "+ changeTo);
		    crowdControl.setVolume(changeTo);
		}
	}
	
	var pointHistory = [];
	var teamScores = {};

	var thingsToSay = {
		newGame : {
			intro : [
				"{Welcome to/And we will start things off at/Thanks for joining us today at} the {BizStream Arena/BizStream Plex/Biz Plex/BizStream Warehouse} on this {{day-description}} {{time-of-day}} for {an excellent/a great/a fun/an exciting} {match-up/game/battle of skill/battle/competition} on the {field/table/foos ball table/playing field}."
				//,"{Welcome to/And we will start things off at/Our game today is at} the {BizStream Areana/BizStream Plex/Biz Plex/BizStream Warehouse} on this {{day-description}} {{time-of-day}} for {an excellent/a great/a fun} {match-up/game/battle of skill/battle/competition}."
			]
		},

		// Options for annoncing when someone scores
		firstPoint : {
			ofTheGame : [
				"First point of the game by {{name}}"
				,"{{name}} {with the/starts us off with the/knocks in the/puts in the} first {score/score of the game/shot on the table}"
				,"{{name}} with the first {score/ball in the hole}"
				,"{{team}} breaks{{team{s|}}} the ice with a 1 to 0 lead. {Great/excellent/nice} {shot/goal/point/score} {by/from} {{name}}."
				,"{{name}} breaks the ice with a 1 to 0 lead"
				,"And now {{team}} {{team{is|are}}} in the lead thanks to {{name}} with the first point"
				//,"wav:and_another_one.wav"
			],
			ofTheTeam : [
				"And now {{team}} {{team{is|are}}} on the board with 1 point by {{name}}"
				,"{{name}} with the first goal for {{team}}"
				,"{{name}} put {{team}} on the board"
				//,"wav:and_another_one.wav"
			],
			ofThePlayer : [
				"And no} {{name}} is scoring points for {{team}}"
				,"{{name}} {has put in/with/puts in/scores/drops/sinks} his first goal for {{team}}"
				,"{{name}} put {{team}} on the board"
				//,"wav:and_another_one.wav"
			]
		},
		playerStreak : {
			multiplePoints : [
				"And another shot by {{name}}"
				,"{{name}} with another goal"
				,"{{name}} sinks another one"
				,"{{name}} drops another one"
				//,"wav:and_another_one.wav"
			],
			twoPoints : [
				 "That's two in a row by {{name}}"
				 ,"{{name}} {knocks/smacks/hits} another one in, {he has/that's/that makes} 2 in a row."
				//,"wav:and_another_one.wav"
			]
		}
	}


	var sayThis_PlayerScores_Player_MultiplePointStreak = [
	];

	var sayThis_PlayerScores_Player_2PointStreak = [
	];

	var sayThis_PlayerScores_Player_3PointStreak = [
		"That's three in a row by {{name}}"
		,"{{name}} with another goal. 3 point streak."
		,"And he sinks another one. Three in a row by {{name}}"
		//,"wav:and_another_one.wav"
	];

	var sayThis_PlayerScores_Player_4PointStreak = [
		"{{name}} is going streaking! That's a quad-point streak."
		,"{{name}} with another point. That's a 4 goals streak!"
		//,"wav:and_another_one.wav"
	];

	var sayThis_PlayerScores_Player_5PointStreak = []

	// TEAM STREAKS:
	var sayThis_PlayerScores_Team_MultiplePointStreak = [
		"And another goal by {{team}}"
		,"{{team}} with another goal"
		,"{{team}} sink{{team{s|}}} another one"
		,"{{team}} drop{{team{s|}}} another one"
	]

	var sayThis_PlayerScores_Team_2PointStreak = [
		 "That's two in a row by {{team}}"
		 ,"{{team}} {{team{is|are}}} on a roll"
		//,"wav:and_another_one.wav"
	];

	var sayThis_PlayerScores_Team_3PointStreak = [
		"That's three in a row by {{name}}"
		,"{{name}} with another goal. 3 point streak."
		,"And he sinks another one. Three in a row by {{name}}"
		//,"wav:and_another_one.wav"
	];

	var sayThis_PlayerScores_Team_4PointStreak = []
	var sayThis_PlayerScores_Team_5PointStreak = []


	// "catch-all"/generic
	var sayThis_PlayerScores_Player_ScoresPoint = [
		 "{{name}} scores a goal"
		,"{{name}} puts one in"
		,"{{name}} sinks one"
		//,"wav:and_another_one.wav"
	];

	// "catch-all"/generic
	var sayThis_PlayerScores_Team_ScoresPoint = [
		 "{{team}} score{{team{s|}}} a goal"
		,"{{team}} put{{team{s|}}} one in"
		,"{{team}} sink{{team{s|}}} one"
		//,"wav:and_another_one.wav"
	];

	// "catch-all"/generic
	var sayThis_PlayerScores_Team_ShutOutAlert = [
		 "And we have a shut out alert for {{other-team}}"
		//,"wav:shut_out_alert.wav"
	];


	// power value high
	//"Power Shot by {{name}}"
	//"{{name}} slams one in"
	//"{{name}} puts one right down the throat of [[defender]]"
	var sayThis_PlayerScores_Player_HighPowerShot = [
		,"Power Shot from {{name}}"
		,"{{name}} slams one in"
		,"{{name}} slams one down {{other-team-defense}}'s throat"
	]

	var sayThis_PlayerScores_Player_DefensiveScoreHighPowerShot = [
		,"It's {{name}}! from down town"
		,"{{name}} pounds on {{other-team-defense}} from {the back/the d-fense}"
		,"d-fense, d-fense, d-fense with the score!"
	];

	//TODO
	//	if you are putting in all the points, talk about carrying your team mate

	//  weak "dribble in" shots

	//  it would be really nice to know about fooses

	var sayThis_PlayerScores_Team_ApporachingShutOutMoreThan2Points = [
		 "{{team}} {{team{is|are}}} {putting the hurt on {{other-team}}/gaining a solid lead/working on a shut out/sticking it to {{other-team}}}"
		 ,"{Ouch/Snap/Dang/Hey Now/Oh man/Wow/Look Out/It's On now}, {{other-team}} {{other-team{is|are}}} {in the danger zone now/on their way to a shut out/in need of some points}"
		 ,"{Ouch/Snap/Dang/Hey Now/Oh man/Wow/Look Out/It's On now}, {{other-team}} {need{{other-team{s|}}} to catch up/need{{other-team{s|}}} to make up some points/need{{other-team{s|}}} their first point/is way behind now/is falling behind}"
		 ,"{{other-team}} {{other-team{has|have}}} some {catching up to do/work to do}"
	];

	var sayThis_PlayerScores_ReportScore = [
		 "{We have/Score is} {{team}} with {{team-score}} and {{other-team}} with {{other-team-score}}"
	];

	var sayThis_PlayerScores_ReportScoreTeamWinning = [
		 "{{team}} {{team{is|are}}} winning {{team-score}} to {{other-team-score}}"
		 ,"It's {{team}} over {{other-team}} with a {{team-score}} to {{other-team-score}} lead."
		 ,"{The Score is/We are at/And it is/We're at/The Score board says} {{team-score}} to {{other-team-score}} with {{team}} {leading the drive/on top/out in front}."
	];

	var sayThis_PlayerScores_ReportScoreTeamLosing = [
		 "{{team}} {{team{is|are}}} losing {{team-score}} to {{other-team-score}}"
		 ,"It's {{other-team}} over {{team}} with a {{other-team-score}} to {{team-score}} lead."
		 ,"{The Score is/We are at/And it is/We're at/The Score board says} {{other-team-score}} to {{team-score}} with {{other-team}} {leading the drive/on top/out in front}."
		 ,"{The Score is/We are at/And it is/We're at/The Score board says} {{other-team-score}} to {{team-score}} with {{team}} {trailing behind/at the bottom/trying to catch up/needing to gain some points}."
	];

	var sayThis_PlayerScores_ReportTiedScore = [
		 "Score is {tied/all tied} up at {{team-score}} to {{other-team-score}}"
		 ,"{And we are/The scores are/It's all} tied up at {{team-score}} to {{other-team-score}}"
		 ,"And the scores are at {{team-score}} and {{other-team-score}}"
		 ,"{All tied up at/we're even with a score of/It's anyones game with a score of} {{team-score}} and {{other-team-score}}"
	];

	var sayThis_PlayerScores_ReportTiedScoreNextPointWins = [
		"{And now/OK boys and girls,} it just got real {{team-score}} to {{other-team-score}}"
		,"{We have/And now it's} fours all around, next point wins"
		,"And fours all around, next point wins"
	]

	// Final POINT
	var sayThis_PlayerScores_Game_FinalPoint_CloseGame = [
		"And the {final/last/winning} {point/goal/score} by {{name}} finishes out {a close game/a nail-biter/an intense match-up} defeating {{other-team}}"
		,"{And that is the end of the game/And that's all folks/And that brings this game to a conclusion}. {{other-team}} has been {beaten/defeated} by {{team}} in a {very close match/tight game/close match/very close game} with a {{team-score}} to {{other-team-score}} {victory/win}."
		,"{And that is the end of the game/And that's all folks/And that brings this game to a conclusion}. {{team}} has {beaten/defeated/won over} {{other-team}} in a {very close match/tight game/close match/very close game} with a {{team-score}} to {{other-team-score}} {victory/win}."
		,"{And that is the end of the game/And that's all folks/And that brings this game to a conclusion}. {{team}} has won in a {very close match/tight game/close match/very close game} with a {{team-score}} to {{other-team-score}} {victory/win} over {{other-team}}."
		//,"And the {final/last/winning} {point/goal/score} by {{name}} finishes out {a close game/a nail-biter/an intense match-up} defeating {{other-team}}"
		//,"wav:and_another_one.wav"
	];

	var sayThis_PlayerScores_Game_FinalPoint_Other = [
		"{{name}} {puts in/with/drops in/knocks in/scores/sinks} the final {point/score/goal} against {{other-team}} giving {{team}} yet another {victory/win} with a final score of {{team-score}} to {{other-team-score}}."
		,"And {that ends/that is the end of} the game for {{other-team}}, giving {{team}} yet another {victory/win}. The final score is {{team-score}} to {{other-team-score}}."
		,"{And that is the end of the game/And that's all folks/And that brings this game to a conclusion}. {{other-team}} has been {beaten/defeated} by {{team}} with a {{team-score}} to {{other-team-score}} {victory/win}."
		//,"wav:and_another_one.wav"
	];

	var sayThis_PlayerScores_Game_FinalPoint_ShutOut = [
		"{{name}} with the final {nail in the coffin/score/goal} against the {{other-team}} gives {{team}} yet another {shut out/crushing 5 to 0 victory/devastating 5 and O victory}."
		,"{And that is the end of the game/And that's all folks/And that brings this game to a conclusion}. {{other-team}} has been {shut out/blanked/crushed/annihilated/demolished} by {{team}}"
		//,"wav:and_another_one.wav"
	];
	//END Final Point

	// player scores and it took over 2 minutes
	// "Wow, that point took some effort"
	// "That point took some time, {{name}} should get extra points for that shot"



	// Options for annoncing throughout the game
	var sayThis_NoScoreFor60Seconds = [
		"Someone needs to get a goal in"
		,"Let's see some action"
		//,"wav:boo.wav"
	];

	var sayThis_NoScoreFor120Seconds = [
		"You need to work for this point"
		//,"wav:boo.wav"
	];


	// Functions

	var getPlayer = function(oFilter) {
		var matchingPlayer;
		config.players.forEach(function(player) {
		    if (player.playerid == oFilter.playerid)
		    	matchingPlayer = player;
		});
		return matchingPlayer;
	}

	var getTeam = function(color, bOtherTeam) {
		var matchingTeam;
		config.teams.forEach(function(team) {
			//console.log(player)
			//console.log(oFilter)
		    if (bOtherTeam) {
			    if (team.color != color)
			    	matchingTeam = team;
		    } else {
			    if (team.color == color)
			    	matchingTeam = team;
		    }
		});
		return matchingTeam;
	}

	var getMessageTimeOfDay = function() {
		var d = new Date();
		var weekday = ["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"];

		var dayOfTheWeek = weekday[d.getDay()];
		var timeOfDay = "";

		var h = d.getHours();
		var m = d.getMinutes();

		if (h <= 10) { timeOfDay = "Morning"; }
		else if (h <= (1)) { timeOfDay = "{Lunch Time/noon time}"; dayOfTheWeek = ""; }
		else if (h <= (4)) { timeOfDay = "after noon"; }
		else if (h <= (8)) { timeOfDay = "evening"; }
		else if (h <= (23)) { timeOfDay = "night"; }

		return dayOfTheWeek +" "+ timeOfDay;
	}

	var updateLocalEnviromentInfo = function(doThisWhenDone) {
		//http://api.openweathermap.org/data/2.5/weather?q=Allendale,MI		
		$.get("http://api.openweathermap.org/data/2.5/weather", {q:"Allendale,MI"}, function(r) {
			debug(r);
			weather.temperature = ((9/5)*(r.main.temp - 273.15)) + 32; // K to F
			weather.wind = r.wind.speed *  2.2369362920544; // mps to MPH
			weather.condition = r.weather;
			debug(weather);

			doThisWhenDone();
		})
	}

	var getMessageDayDescription = function() {
		// http://www.openweathermap.org/weather-data#current
		// http://www.openweathermap.org/weather-conditions
		var temp = ""; 
		var wind = "";
		var cond = [];
		if (weather.temperature < 0) temp = "{bloody freezing/ridiculously cold}";
		else if (weather.temperature <= 10) temp = "freezing";
		else if (weather.temperature <= 40) temp = "{cold/wintery}"; // yes, I put in the empty option on purpose
		else if (weather.temperature >= 100) temp = "{scorching hot/ridiculously hot}";
		else if (weather.temperature >= 90) temp = "{toasty/hot}";
		else if (weather.temperature >= 85) temp = "hot";
		else if (weather.temperature >= 80) temp = "summer";
		else if (weather.temperature >= 70) temp = "warm";

		if (weather.wind <= 5) wind = "";
		else if (weather.wind <= 10) wind = "windy";
		else if (weather.wind <= 20) wind = "windy/gusty";
		else if (weather.wind <= 30) wind = "ridiculously windy";
		if (wind != "") cond.push(wind);

		if (weather.condition.length > 0) {
			weather.condition.forEach(function(c) {
				if (/overcast/.test(c.description)) cond.push("overcast"); 
				else if (/cloud/.test(c.description)) cond.push("partly cloduy"); 
				else if (/clear sky/.test(c.description)) cond.push("sunny");
				else if (/heavy.*snow/.test(c.description)) cond.push("riduclusly snowy");
				else if (/snow/.test(c.description)) cond.push("snowy");
				else if (/sleet/.test(c.description)) cond.push("nasty");
				else if (/heavy.*rain/.test(c.description)) cond.push("riduclusly rainy/riduclusly wet");
				else if (/rain/.test(c.description)) cond.push("rainy/wet");
				else if (/drizzle/.test(c.description)) cond.push("wet");
				else if (/thunderstorm/.test(c.description)) cond.push("stormy");
			});

			debug(cond)
			cond = "{"+ cond.join("/") +"}";
		}
		if (cond != "") cond = ", "+ cond;

		// cold, windy, wet
		// warm, sunny
		// cold
		// if both have a value...
		if (temp != "" && cond != "") {
			if (Math.random() > .5)
				return (temp + cond);
			else if (Math.random() > .5)
				return (temp);
			else  
				return (cond);
		} else {
			return (temp + cond);
		}
	}

	var updateMessageReplacements = function(originalMessage, oPlayer, oTeam, oOtherTeam) {
		var playerName = getRandomItem(oPlayer.names);
		var teamName =  oTeam.team;
		var otherTeamName =  oOtherTeam.team;


		var teamEndsInS = (teamName.substr(-1,1) == "s");
		var otherTeamEndsInS = (otherTeamName.substr(-1,1) == "s");

		debug(teamName, teamName.substr(-1,1), teamEndsInS);
		debug(otherTeamName, otherTeamName.substr(-1,1), otherTeamEndsInS);

		var msg = originalMessage
			.replace(/{{name}}/g, playerName)
			.replace(/{{name}}/g, playerName)
			.replace(/{{team}}/g, teamName)
			.replace(/{{other\-team}}/g, otherTeamName)
			.replace(/{{team\-score}}/g, oTeam.score)
			.replace(/{{other\-team\-score}}/g, oOtherTeam.score)
			.replace(/{{team{has\|have}}}/g, (teamEndsInS ? "have" : "has"))  // The Dream Team [has]... The Avengers [have]
			.replace(/{{team{is\|are}}}/g, (teamEndsInS ? "are" : "is"))  // The Dream Team [is]... The Avengers [are]
			.replace(/{{team{s\|}}}/g, (teamEndsInS ? "" : "s"))  // The Dream Team score[s]... The Avengers score[]
			.replace(/{{other\-team{has\|have}}}/g, (otherTeamEndsInS ? "have" : "has"))  // The Dream Team [has]... The Avengers [have]
			.replace(/{{other\-team{is\|are}}}/g, (otherTeamEndsInS ? "are" : "is"))  // The Dream Team [is]... The Avengers [are]
			.replace(/{{other\-team{s\|}}}/g, (otherTeamEndsInS ? "" : "s"))  // The Dream Team score[s]... The Avengers score[]
			;

		//check for any "calculated replacements"
		if (/time\-of\-day/.test(msg)) {
			msg = msg.replace(/{{time\-of\-day}}/g, getMessageTimeOfDay());
		}
		if (/day\-description/.test(msg)) {
			msg = msg.replace(/{{day\-description}}/g, getMessageDayDescription());
		}

		// find each set of curly braces
		debug('Prefiltered Message: ' + msg)
		var aRandomReplacements = msg.match(/{(.*?)}/g);
		if (aRandomReplacements && aRandomReplacements.length > 0) {
			aRandomReplacements.forEach(function(item) {
				var replacements = item.replace("{", "").replace("}", "").split("/");
				debug('Replacement Messages: ' + replacements)
				msg = msg.replace(item, replacements[Math.floor(Math.random() * replacements.length) ]);
			});
		}

		debug('Message: ' + msg)



		return msg;
	}

	var updateStreaks = function(oPlayer, oTeam, oOtherTeam) {
		oPlayer.pointStreak++;
		oTeam.pointStreak++;

		oOtherTeam.pointStreak = 0;
		config.players.forEach(function(player) {
		    if (player.playerid != oPlayer.playerid)
		    	player.pointStreak = 0;
		});

		debug(oPlayer);
		debug(config.players);
	}

	var getRandomItem = function(aData) {
		return aData[Math.floor(Math.random()*aData.length)];
	}

	var resetGame = function() {
		if (tmrGameUpdates != null)
			clearInterval(tmrGameUpdates);

		config.teams.forEach(function(team) {
			team.score = 0;
			team.pointStreak = 0;
		});

		config.players.forEach(function(player) {
			player.score = 0;
			player.pointStreak = 0;
		});
	}

	var endGame = function() {




	}

	var newGame = function(c) {
		resetGame();
		// do sound effects
		crowdControl.startCrowd();

		// can't make the welcome announcement until we load the weather data
		updateLocalEnviromentInfo(function(){
			// when all of the local enviroment info is updated, now we can start the game
			var sayThisOptions = [];
			sayThisOptions = sayThisOptions.concat(thingsToSay.newGame.intro);

			var message = getRandomItem(sayThisOptions);

			var oPlayer    = config.players[0]; // first random player
			var oTeam      = config.teams[0];
			var oOtherTeam = config.teams[1];


			message     = updateMessageReplacements(message, oPlayer, oTeam, oOtherTeam)
			sayThis(message);
			tmrGameUpdates = setInterval(giveGameUpdates, 5000);
		});
	}

	var giveGameUpdates = function() {
		// goal -.04 to .06
	 	crowdControl.adjustVolume((Math.random() - .4) * .1);
	}

	var getSoundFile = function(whichSound) {
		var fileName = "";
		switch (whichSound) {
			case "crowd": fileName = "crowd.wav"; break;
			case "applause": fileName = 'applause-' + (Math.floor(Math.random() * 3) + 1 )+ '.wav'; break;; break;
			case "end": fileName = 'end-of-game-' + (Math.floor(Math.random() * 1) + 1 )+ '.wav'; break;; break;
			case "score": fileName = 'score-' + (Math.floor(Math.random() * 5) + 1 )+ '.mp3'; break;
			case "win": fileName = 'win-' + (Math.floor(Math.random() * 1) + 1 )+ '.mp3'; break;
		}
		return soundRootPath + fileName;
	}

	var playSound = function(soundType) {
		var sound = new Audio(getSoundFile(soundType));
		sound.play();
	}

	var scorePoint = function(oPlayer, gameTime) {
		var oPlayer    = getPlayer(oPlayer);
		var oTeam      = getTeam(oPlayer.color);
		var oOtherTeam = getTeam(oPlayer.color, true);

		oTeam.score++;   // update team score
		oPlayer.score++; // update player score

		// fake a random volumne
		var gameCompleteMessageDelay = 0;
		var shotPowerLevel = crowdControl.ensureSafeVolume(.25 + Math.random(), crowdControl.audioElement.volume)
		debug(shotPowerLevel)

		// play a sound effect
		if (oTeam.score == config.pointsNeededToWin) {
			playSound("win");
			crowdControl.playApplause("applause", shotPowerLevel); //FUTURE: Pass level 0-1 based on strength of shot
			//crowdControl.playApplause("end-of-game", .6); //FUTURE: Pass level 0-1 based on strength of shot
			//gameCompleteMessageDelay = 5000;
		}
		else {
			playSound("score");
			crowdControl.playApplause("applause", shotPowerLevel); //FUTURE: Pass level 0-1 based on strength of shot
			gameCompleteMessageDelay = shotPowerLevel;
		}


		updateStreaks(oPlayer, oTeam, oOtherTeam);
		

		// array to be used to load random options of messages
		var sayThisOptions = [];
		var sayThisAlsoOptions = [];

		// if this is the first point of the team or game
		if (oTeam.score == 1) {
			if (oOtherTeam.score == 0) {
				sayThisOptions = sayThisOptions.concat(thingsToSay.firstPoint.ofTheGame);
			} else {
				sayThisOptions = sayThisOptions.concat(thingsToSay.firstPoint.ofTheTeam);
			}
		}

		// STREAKS!!!
		// If a player is streaking, note that FIRST
		if (oPlayer.pointStreak >= 2) {

			if (oPlayer.pointStreak >= 5) {
				sayThisOptions = sayThisOptions.concat(sayThis_PlayerScores_Player_5PointStreak);
			} else if (oPlayer.pointStreak >= 4) {
				sayThisOptions = sayThisOptions.concat(sayThis_PlayerScores_Player_4PointStreak);
			} else if (oPlayer.pointStreak >= 3) {
				sayThisOptions = sayThisOptions.concat(sayThis_PlayerScores_Player_3PointStreak);
			} else {
				sayThisOptions = sayThisOptions.concat(sayThis_PlayerScores_Player_2PointStreak);
				sayThisOptions = sayThisOptions.concat(sayThis_PlayerScores_Player_MultiplePointStreak);
			}
		} else 
		// If a teams is streaking, note that SECONDARILY
		if (oTeam.pointStreak >= 2) {

			if (oTeam.pointStreak >= 5) {
				sayThisOptions = sayThisOptions.concat(sayThis_PlayerScores_Team_5PointStreak);
			} else if (oTeam.pointStreak >= 4) {
				sayThisOptions = sayThisOptions.concat(sayThis_PlayerScores_Team_4PointStreak);
			} else if (oTeam.pointStreak >= 3) {
				sayThisOptions = sayThisOptions.concat(sayThis_PlayerScores_Team_3PointStreak);
			} else {
				sayThisOptions = sayThisOptions.concat(sayThis_PlayerScores_Team_2PointStreak);
				sayThisOptions = sayThisOptions.concat(sayThis_PlayerScores_Team_MultiplePointStreak);
			}
		}

		debug("Scores: " + oTeam.score + ", " + oOtherTeam.score)

		if (oOtherTeam.score == 0) {
			if (oTeam.score == 4) {
				// empty any previous entries, this is imporant :)
				sayThisOptions = sayThis_PlayerScores_Team_ShutOutAlert;
			} else if (oTeam.score >= 2) {
				sayThisOptions = sayThis_PlayerScores_Team_ApporachingShutOutMoreThan2Points;
			}
		} else if (oOtherTeam.score + oTeam.score >= 3) {
			// let's also announce the score
			// score is tied up
			debug("oOtherTeam.score == oTeam.score =>", oOtherTeam.score == oTeam.score)
			// if it is tied up
			if (oOtherTeam.score == oTeam.score) {
				if (oOtherTeam.score == 4) {
					sayThisAlsoOptions = sayThis_PlayerScores_ReportTiedScoreNextPointWins;
				} else {
					sayThisAlsoOptions = this.sayThis_PlayerScores_ReportTiedScore;
				}
			} else {
				sayThisAlsoOptions = sayThis_PlayerScores_ReportScore;
				if (oTeam.score > oOtherTeam.score)
				{
					sayThisAlsoOptions = sayThisAlsoOptions.concat(sayThis_PlayerScores_ReportScoreTeamWinning);
				} else {
					sayThisAlsoOptions = sayThisAlsoOptions.concat(sayThis_PlayerScores_ReportScoreTeamLosing);
				}
			}
		}

		// FINAL POINT
		//console.log(oTeam.score,config.pointsNeededToWin)
		if (oTeam.score == config.pointsNeededToWin) {
			var closeMatchPoints = (config.pointsNeededToWin - 1); // eventually should be a percentage

			// clear original arrays
			sayThisAlsoOptions = [];
			if (oOtherTeam.score == closeMatchPoints) {
				sayThisOptions = sayThis_PlayerScores_Game_FinalPoint_CloseGame;
			} else if (oOtherTeam.score == 0) {
				sayThisOptions = sayThis_PlayerScores_Game_FinalPoint_ShutOut;
			} else {
				sayThisOptions = sayThis_PlayerScores_Game_FinalPoint_Other;
			}
		}


		// if there is nothing else, use the defaults
		if (sayThisOptions.length == 0) {
			sayThisOptions = sayThisOptions.concat(sayThis_PlayerScores_Player_ScoresPoint);
			sayThisOptions = sayThisOptions.concat(sayThis_PlayerScores_Team_ScoresPoint);
		}

		var message = getRandomItem(sayThisOptions);
		var alsoMessage;
		//debug("sayThisAlsoOptions.length: "+ sayThisAlsoOptions.length)
		if (sayThisAlsoOptions && sayThisAlsoOptions.length > 0) {
			alsoMessage = getRandomItem(sayThisAlsoOptions);			
		}
		var returnMessage
		message     = updateMessageReplacements(message,     oPlayer, oTeam, oOtherTeam)
		returnMessage = message;
		if (alsoMessage) {
			alsoMessage = updateMessageReplacements(alsoMessage, oPlayer, oTeam, oOtherTeam)
			returnMessage = returnMessage +". "+ alsoMessage; 
		}

		// add to point history array
		pointHistory.push({ "player": oPlayer, "time": gameTime});

		// put a slight delay on the announcement
		setTimeout(function() {
			sayThis(returnMessage);
		}, (1500 + (shotPowerLevel * 3000)));

		// return to user
		return { "message":returnMessage };
	}

	var voiceTest = function() {
		//sayThis("Kevin Stachura");
		//sayThis("Big Red");
		//sayThis("Sterling Heibeck");
		sayThis("Nick Beukema");
		sayThis("The Sterl");
		sayThis("The Ninja");
	}

	var doWordFixes = function(msg) {
		return msg.replace(/BizStream/g, "Biz Stream")
			.replace(/The Sterl/g, "The Sturl")
			.replace(/Beukema/g, "Beukuma")
		;
	}

	var sayThis = function(message) {
		//alert(config.useTTS)
		if (config.useTTS) {
			debug("sayThis: "+ message);
			message = doWordFixes(message);
			debug("sayThis: "+ message);
			var msg = new SpeechSynthesisUtterance(message);
			msg.lang = 'en-GB'; //translates on the fly - soooo awesome (japanese is the funniest)

			var originalVolume = crowdControl.getVolume();
			msg.onend = function(e) {
				debug("restore the volume...");
				crowdControl.setVolume(originalVolume);
			};


			//msg.volume = 1; // 0 to 1
			//msg.rate = 1; // 0.1 to 10
			//msg.pitch = 2; //0 to 2
			//msg.voice = 'Hysterical'; // this seems to do nothing
			debug("lower volume for speaking...");
			crowdControl.setVolume(crowdControl.ensureSafeVolume(originalVolume-.5, 0.05));
			window.speechSynthesis.speak(msg);
		}
	}

	var dumpVoices = function() {
		speechSynthesis.getVoices().forEach(function(voice) {
			console.log(voice.name, voice.default ? '(default)' :'');
		});
	}

	var init = function(c) {
		debug(c);
		config = MergeRecursive(config, c);

		newGame(); 

		debug(config);
	}

	function debug(item){
		if(config.debug){
			console.log(item);
		}
	}

	var textExport = function() {

	}


	return {
		getPlayer: getPlayer,
		getTeam: getTeam,
		updateMessageReplacements: updateMessageReplacements,
		updateStreaks: updateStreaks,
		getRandomItem: getRandomItem,
		scorePoint: scorePoint,
		sayThis: sayThis,
		voiceTest: voiceTest,
		textExport: textExport,
		init: init
	};




}]);