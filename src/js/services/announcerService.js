// TO DO
// player Gender
// player NickNames
// Team Names

// announce player positions and the home team (yellow) and the away team (black)

// todo: simulate noise levels

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
	/*
		soundsToMake.music.intro
		soundsToMake.music.win
		soundsToMake.score.point
		soundsToMake.organ.charge
		soundsToMake.organ.chargeLong
		soundsToMake.organ.cheer
		soundsToMake.background.crowd
		soundsToMake.positiveCrowd.airhorn
		soundsToMake.positiveCrowd.cheer
		soundsToMake.positiveCrowd.chant
		soundsToMake.negativeCrowd.aww
		soundsToMake.negativeCrowd.boo
		soundsToMake.negativeCrowd.ohno
	*/
	var soundsToMake = {
		music : {
			intro : [
				"intro.wav"
			],
			win : [
				"win-1.mp3", 
			]
		},
		score : {
			point : [
				"score-1.mp3", 
				"score-2.mp3", 
				"score-3.mp3", 
				"score-4.mp3", 				
				"score-5.mp3", 
				"score-6.wav"
			]
		},
		organ : {
			charge : [
				"cheering-charge-1.wav", 
				"organ-hockey-organ-charge_GkVzP3EO.mp3", 
				"organ-hockey-organ-melody-in-stadium-arena_M17SP3EO.mp3", 
				"organ-hockey-organ-melody-lets-go_fJT8P3N_.mp3", 
			],
			chargeLong : [
				"organ-sports-arena-music-organ-charge-ascend-reverb.mp3", // 18s
				"organ-sports-arena-music-organ-melody-ascend-reverb_M1ptqYEu.mp3", // 16s
				"organ-sports-arena-music-mexican-hat-dance-organ-clap_fyxsqtNu.mp3", // 11s
			],
			cheer : [
				"organ-short-single-chord-sports-arena-music-organ-chord-stab-reverb_Gkn29tNu.mp3", 
			]
		},
		background : {
			crowd : [
				"crowd.wav" 
			],
		},
		positiveCrowd : {
			airhorn : [
				"air-horn_Mka55z4u.mp3", 
				"airhorn.wav"
			],
			cheer : [
				"applause-1.mp3", 
				"applause-1.wav", 
				"applause-2.wav", 
				"applause-3.wav", 
				"applause-4.wav", 
				"applause-5.wav", 
				"cheer-crowd-battle-cry-ahhhoh_M1S_ZOV_.mp3", 
				"cheer-crowd-cheer-clap-scream_fJkt-OV_.mp3", 
				"cheer-crowd-hooray_MJzKZ_4_.mp3", 
				"cheer-crowd-loud-ohh_zyqq-uEd.mp3", 
				"cheer-crowd-scream-goal_Myqs-u4_.mp3", 
				"cheer-crowd-scream-hooray_z1g3W_4d.mp3", 
				"cheer-crowd-scream-oh-yeah_MyNnbuEd.mp3", 
				"cheer-crowd-scream-ohh_zJL3bO4u.mp3", 
				"cheer-crowd-scream-shocked-whoa_fkd3-dN_.mp3", 
				"cheer-crowd-scream-yes_MykaZO4O.mp3", 
				"cheer-crowd-tongue-rolls_Gy9aZuVd.mp3", 
				"cheer-crowd-vocal-element-goal-long_G1j6-ON_.mp3", 
				"cheer-crowd-yes-unison_MkhTW_V_.mp3", 
				"cheer-sports-event_MJoQI64u.mp3",
				"crowd-cheer-baseball-game.mp3", 
				"crowd-cheer-baseball-game_M1WXv2Nd.mp3", 
				"crowd-cheer-baseball-game_z1IbPhE_.mp3",
				"crowd-scream-go-go-go_zJ6Kb_Nu.mp3", 
				"crowd-scream-whoa_MJAnZO4O.mp3"
			],
			chant : [
				"chant-chanting-concert-applause_zyGZ-HE_.mp3", 
				"chant-male-crowd-chanting-solidarnosc_MknsmSNu.mp3", 
			]
		},
		negativeCrowd : {
			aww : [
				"aww-crowd-aww-disappointed_G1SdWOVd.mp3", 
				"aww-crowd-aww_GJKdZ_Nu.mp3", 
				"aww-crowd-disgusted-aww_G1qd-OVd.mp3", 
				"aww-crowd-disgusted-aww_zkuqZdN_.mp3", 
				"aww-crowd-scream-aww_fJa9Z_V_.mp3"
			],
			boo : [
				"boo-1.wav", 
				"boo-2.wav", 
				"boo-3.wav", 
				"boo-4.wav", 
				"boo-5.wav", 
				"boo-crowd-boo_fkA_ZONd.mp3", 
			],
			ohno : [
				"oh-no-crowd-scream-oh-no_fkm3Zu4_.mp3", 
				"crowd-painful-ohh_fkmKbONO.mp3",
				"boo-crowd-scream-no-different-times_My-nZdNu.mp3", 
				"boo-crowd-scream-no_M1xhZ_Nd.mp3"
			]
		}
	}

	var thingsToSay = {
		//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
		newGame : {
			intro : [
				"{Welcome to/And we will start things off at/Thanks for joining us today at} the {BizStream Arena/BizStream Plex/Biz Plex/BizStream Warehouse} on this {{day-description}} {{time-of-day}} for {an excellent/a great/a fun/an exciting} {match-up/game/battle of skill/battle/competition} on the {field/table/foos ball table/playing field}."
				//,"{Welcome to/And we will start things off at/Our game today is at} the {BizStream Areana/BizStream Plex/Biz Plex/BizStream Warehouse} on this {{day-description}} {{time-of-day}} for {an excellent/a great/a fun} {match-up/game/battle of skill/battle/competition}."
			],
			// yellow-team, black-team, yellow-d, yellow-o, black-d, black-o
			teamsAndPlayersIntro : [
				"For today's match-up we have {{{yellow-team}}/{{yellow-o}} and {{yellow-d}}} on the {yellow/home} team. And on the {black/away} team we have {{black-o}} and {{black-d}}. {{black-o}} will be playing offense for the yellow team and {{yellow-d}} will be {playing defense/defending the goals}"
				//,""
			]
		},

		//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
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
		},

		//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
		// Options for annoncing throughout the game
		gameUpdates : {
			noScoreFor60Seconds : [
				"Someone {needs to/has to/should try to} get a {goal/point/score} in"
				,"Let's see {some action/a point/a goal/someone score/someone put the ball in the hole}"
				,"sound:boo"
				,"sound:airhorn.wav"
			],

			noScoreFor120Seconds : [
				"{Holy cow/Wow/Really}! Someone {needs to/has to/should try to} get a {goal/point/score} in"
				,"Let's see {some action/a point/a goal/someone score/someone put the ball in the hole}"
				//,"sound:boo"
				,"sound:charge"
				//,"sound:airhorn.wav"
			],
			// todo: need to handle the replacements
			stillTiedUp : [
				 "And we are still {tied/all tied} up at {{winning-score}} to {{losing-score}}"
				 ,"{And we are/The scores are/It's all} tied up at {{winning-score}} to {{losing-score}}"
				 ,"And the scores are at {{winning-score}} and {{losing-score}}"
				 ,"{All tied up at/we're even with a score of/It's anyones game with a score of} {{winning-score}} and {{losing-score}}"				
			]
		}

		//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

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
		else if (h <= (12 + 1)) { timeOfDay = "{Lunch Time break/noon time break}"; dayOfTheWeek = ""; }
		else if (h <= (12 + 4)) { timeOfDay = "after noon"; }
		else if (h <= (12 + 8)) { timeOfDay = "evening"; }
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

	var updateMessageReplacements = function(originalMessage, oValues) {
		// oPlayer, oTeam, oOtherTeam
		var playerName;
		var teamName;
		var otherTeamName;
		try {
			playerName = getRandomItem(oValues.oPlayer.names);
			teamName =  oValues.oTeam.team;
			otherTeamName =  oValues.oOtherTeam.team;
		} catch(err) {
			playerName = " ";
			teamName =  " ";
			otherTeamName =  " ";
			oValues.oTeam = {"score": 0}
			oValues.oOtherTeam = {"score": 0}
		}
		
		var teamEndsInS = (teamName.substr(-1,1) == "s");
		var otherTeamEndsInS = (otherTeamName.substr(-1,1) == "s");

		debug(teamName, teamName.substr(-1,1), teamEndsInS);
		debug(otherTeamName, otherTeamName.substr(-1,1), otherTeamEndsInS);

		var msg = originalMessage
			.replace(/{{winning\-score}}/g, oValues["winning-score"])
			.replace(/{{losing\-score}}/g, oValues["losing-score"])
			.replace(/{{yellow\-team}}/g, oValues["yellow-team"])
			.replace(/{{black\-team}}/g, oValues["black-team"])
			.replace(/{{yellow\-d}}/g, oValues["yellow-d"])
			.replace(/{{black\-d}}/g, oValues["black-d"])
			.replace(/{{yellow\-o}}/g, oValues["yellow-o"])
			.replace(/{{black\-o}}/g, oValues["black-o"])
			.replace(/{{name}}/g, playerName)
			.replace(/{{name}}/g, playerName)
			.replace(/{{team}}/g, teamName)
			.replace(/{{other\-team}}/g, otherTeamName)
			.replace(/{{team\-score}}/g, oValues.oTeam.score)
			.replace(/{{other\-team\-score}}/g, oValues.oOtherTeam.score)
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

		debug('Prefiltered Message: ' + msg)
		// find each set of curly braces
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

		config.gameStartTime = new Date();
		config.timeLastGoalWasScored = config.gameStartTime;
		config.timeLastAnnouncementWasMade = config.gameStartTime;

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
		
		playSound(soundsToMake.music.intro);

		// give it a small delay to the the intro play
		setTimeout(speakOpeningMessage, 5000);
	}

	var speakOpeningMessage = function() {
		// can't make the welcome announcement until we load the weather data
		updateLocalEnviromentInfo(function(){
			// when all of the local enviroment info is updated, now we can start the game
			var message = getRandomItem(thingsToSay.newGame.intro);
			message     = updateMessageReplacements(message, {})
			sayThis(message);

			//todo, also announce player positions and team names and colors/sides
			message = getRandomItem(thingsToSay.newGame.teamsAndPlayersIntro);
			message = updateMessageReplacements(message, {
				// yellow-team, black-team, yellow-d, yellow-o, black-d, black-o
				"yellow-team": getTeam("yellow").team,
				"yellow-o": "Mark",
				"yellow-d": "Sterling",
				"black-team": getTeam("black").team,
				"black-o": "Adam",
				"black-d": "Albert",
			});
			//sayThis(message);

			tmrGameUpdates = setInterval(giveGameUpdates, 7000);
		});
	}

	var getSecondSince = function(dateSinceWhen) {
		var now = new Date();
		return (now.getTime() - dateSinceWhen.getTime()) / 1000;
	}

	var giveGameUpdates = function() {
		var secondsSinceLastAnnouncement = getSecondSince(config.timeLastAnnouncementWasMade);
		if (secondsSinceLastAnnouncement > 15) {
			var secondsSinceLastScore = getSecondSince(config.timeLastGoalWasScored);
			debug("seconds since last goal: "+ secondsSinceLastScore);
			var sayThisOptions = [];
			var bLetSeeSomeAction = (secondsSinceLastScore > 60);
			var bLetSeeSomeActionAllowBoos = (secondsSinceLastScore > 120);

			if (config.teams[0].score == config.teams[1].score && secondsSinceLastAnnouncement > 60) {
				// all tied up
				//TODO: Make this happen
				sayThisOptions = sayThisOptions.concat(thingsToSay.gameUpdates.stillTiedUp);
			}

			if (secondsSinceLastScore > 120)  {
				sayThisOptions = sayThisOptions.concat(thingsToSay.gameUpdates.noScoreFor120Seconds);
			} else if (secondsSinceLastScore > 60)  {
				sayThisOptions = sayThisOptions.concat(thingsToSay.gameUpdates.noScoreFor60Seconds);
			}
			if (sayThisOptions && sayThisOptions.length > 0) {
				
				if (bLetSeeSomeAction && Math.random() > .2) {
					// don't do it every single time
					if (Math.random() > .6)
						playChargeSound(bLetSeeSomeActionAllowBoos, false);
				} else {
					var msg = getRandomItem(sayThisOptions);
					msg = updateMessageReplacements(msg, {
						 "winning-score": config.teams[0].score
						,"losing-score": config.teams[0].score
					});
					doThis(msg);
				}
			}


		}
		// goal -.04 to .06
	 	crowdControl.adjustVolume((Math.random() - .4) * .1);
	}

	// this function will take in anything you throw at it. string, array of arrays, a single array, or an object of arrays
	var getSoundFile = function(whichSound) {
		var fileName = "";
		//debug(whichSound)
		//debug("type of: "+ (typeof whichSound))
		//debug("$.isPlainObject: "+ ($.isPlainObject(whichSound)));
		if (typeof whichSound == "stirng") {
			switch (whichSound) {
				// http://soundbible.com/tags-crowd.html
				case "boo": 	 whichSound = soundsToMake.negativeCrowd; break;
				case "charge": 	 whichSound = [soundsToMake.organ.charge,soundsToMake.organ.chargeLong,soundsToMake.positiveCrowd.chant]; break;
			}
		}
		if (typeof whichSound == "object") {
			var aryChooseFrom = [];

			//debug("Array.isArray(whichSound): "+ Array.isArray(whichSound))
			if (Array.isArray(whichSound)) {
				//debug(typeof whichSound)
				//debug("Array.isArray(whichSound[0]): "+ Array.isArray(whichSound[0]))
				if (Array.isArray(whichSound[0])) {
					// if it is an array of arrays, we need to concat
					whichSound.forEach(function(aryOfSound) {
						aryChooseFrom = aryChooseFrom.concat(aryOfSound);
					});
				} else {
					// a single array
					 aryChooseFrom = whichSound;
				}
			} else {
				// if it is an object of arrays, we need to concat
				//debug("I AM AN OBJECT WITH ARRAYS")
				for (var key in whichSound) {
					aryChooseFrom = aryChooseFrom.concat(whichSound[key]);
				}
			}
			fileName = getRandomItem(aryChooseFrom);
		} else {
			switch (whichSound) {
				// http://soundbible.com/tags-crowd.html
				case "intro": 	 fileName = "intro.wav"; break;
				case "crowd": 	 fileName = "crowd.wav"; break;
				case "applause": fileName = 'applause-' + (Math.floor(Math.random() * 5) + 1 )+ '.wav'; break;; break;
				case "boo": 	 fileName = 'boo-' + (Math.floor(Math.random() * 5) + 1 )+ '.wav'; break;; break;
				case "charge": 	 fileName = 'cheering-charge-' + (Math.floor(Math.random() * 1) + 1 )+ '.wav'; break;; break;
				case "end": 	 fileName = 'end-of-game-' + (Math.floor(Math.random() * 1) + 1 )+ '.wav'; break;; break;
				case "score": 	 fileName = 'score-' + (Math.floor(Math.random() * 6) + 1 )+ '.mp3'; break;
				case "win": 	 fileName = 'win-' + (Math.floor(Math.random() * 1) + 1 )+ '.mp3'; break;
				default: fileName = whichSound;
			}
		}
		debug("getSoundFile: "+ fileName); 
		return soundRootPath + fileName;
	}

	var playSound = function(soundType) {
		var sound = new Audio(getSoundFile(soundType));
		sound.play();
	}

	var playChargeSound = function(allowNegative, delayIt) {
		var playCharge = function() {
			var soundList = [
				soundsToMake.organ.charge,
				soundsToMake.organ.chargeLong,
				soundsToMake.positiveCrowd.chant,
				soundsToMake.positiveCrowd.airhorn,
			]
			if (allowNegative) soundList = soundList.concat(soundsToMake.negativeCrowd.boo);
			playSound(soundList);			
		}
		if (delayIt)
			setTimeout(playCharge, (5000 + (Math.random() * 15000)));
		else
			playCharge();
	}

	var scorePoint = function(oPlayer, gameTime) {
		var oPlayer    = getPlayer(oPlayer);
		var oTeam      = getTeam(oPlayer.color);
		var oOtherTeam = getTeam(oPlayer.color, true);

		oTeam.score++;   // update team score
		oPlayer.score++; // update player score

		config.timeLastGoalWasScored = new Date(); // update last point
		oTeam.timeLastGoalWasScored = config.timeLastGoalWasScored;
		oPlayer.timeLastGoalWasScored = config.timeLastGoalWasScored;

		// fake a random volumne
		var gameCompleteMessageDelay = 0;
		var shotPowerLevel = crowdControl.ensureSafeVolume(.25 + Math.random(), crowdControl.audioElement.volume)
		debug(shotPowerLevel)

		// play a sound effect
		if (oTeam.score == config.pointsNeededToWin) {
			playSound(soundsToMake.music.win);
			crowdControl.playApplause(soundsToMake.positiveCrowd, shotPowerLevel); //FUTURE: Pass level 0-1 based on strength of shot
			//crowdControl.playApplause("end-of-game", .6); //FUTURE: Pass level 0-1 based on strength of shot
			//gameCompleteMessageDelay = 5000;
		}
		else {
			playSound(soundsToMake.score.point);
			
			// if you are the home team/yellow
			//if (Math.random() >.3) {
			if (oTeam.color == "yellow") {
				crowdControl.playApplause(soundsToMake.positiveCrowd, shotPowerLevel); //FUTURE: Pass level 0-1 based on strength of shot

				// occasionally, play another random sound
				if (Math.random() <.2) {
					//10 to 20 secnds in the future
					setTimeout(function() { playSound(soundsToMake.positiveCrowd) }, 10000 + (Math.random() * 10000));
				}
			} else { // if you are the away team/black
				crowdControl.playApplause(soundsToMake.negativeCrowd, shotPowerLevel); //FUTURE: Pass level 0-1 based on strength of shot

			}
			gameCompleteMessageDelay = shotPowerLevel;
		}


		updateStreaks(oPlayer, oTeam, oOtherTeam);
		

		// array to be used to load random options of messages
		var sayThisOptions = [];
		var sayThisAlsoOptions = [];

		// TODO: IF THe score took more than 120 seconds
		// FINALLY SOMEONE SCORED

		// TODO: IF the score was rapids fire
		// Wow, another one, rapid fire...


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
				playChargeSound(false, true);
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
					playChargeSound(false, true);
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
		message     = updateMessageReplacements(message,     { oPlayer : oPlayer, oTeam : oTeam, oOtherTeam : oOtherTeam })
		returnMessage = message;
		if (alsoMessage) {
			alsoMessage = updateMessageReplacements(alsoMessage, { oPlayer : oPlayer, oTeam : oTeam, oOtherTeam : oOtherTeam })
			returnMessage = returnMessage +". "+ alsoMessage; 
		}

		// add to point history array
		pointHistory.push({ "player": oPlayer, "time": gameTime});

		// put a slight delay on the announcement
		setTimeout(function() {
			doThis(returnMessage);
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

	var doThis = function(doThisThing) {
		if (/sound\:/.test(doThisThing)) {
			playSound(doThisThing.replace("sound:", ""));
		} else {
			// assume it is text that needs to be spoken
			sayThis(doThisThing);
		}
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
			config.timeLastAnnouncementWasMade = new Date();
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