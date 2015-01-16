function SmartAnnouncer(config) {
	self = this;

	this.config = {
		"pointsNeededToWin": 5,
		"useTTS": true,
		"debug": false
	}
	$.extend(this.config, config);
	console.log(this.config)
	this.pointHistory = [];

	this.teamScores = {};


	// Options for annoncing when someone scores
		this.sayThis_PlayerScores_Game_FirstPoint = [
			"First point of the game by {{name}}"
			,"{{name}} {with the/starts us off with the/knocks in/puts in} first {score/score of the game/shot on the table}"
			,"{{name}} with the first {score/ball in the hole}"
			,"{{name}} break{{team{s|}}} the ice with a 1 to 0 lead"
			,"And now {{team}} {{team{is|are}}} in the lead thanks to {{name}} with the first point"
			//,"wav:and_another_one.wav"
		];

		this.sayThis_PlayerScores_Team_FirstPoint = [
			"And now {{team}} is on the board with 1 point by {{name}}"
			,"{{name}} with the first goal for {{team}}"
			,"{{name}} put {{team}} on the board"
			//,"wav:and_another_one.wav"
		];

		this.sayThis_PlayerScores_Player_MultiplePointStreak = [
			"And another shot by {{name}}"
			,"{{name}} with another goal"
			,"{{name}} sinks another one"
			,"{{name}} drops another one"
			//,"wav:and_another_one.wav"
		];

		this.sayThis_PlayerScores_Player_2PointStreak = [
			 "That's two in a row by {{name}}"
			//,"wav:and_another_one.wav"
		];

		this.sayThis_PlayerScores_Player_3PointStreak = [
			"That's three in a row by {{name}}"
			,"{{name}} with another goal. 3 point streak."
			,"And he sinks another one. Three in a row by {{name}}"
			//,"wav:and_another_one.wav"
		];

		this.sayThis_PlayerScores_Player_4PointStreak = [
			"{{name}} is going streaking! That's a quad-point streak."
			,"{{name}} with another point. That's a 4 goals streak!"
			//,"wav:and_another_one.wav"
		];

		this.sayThis_PlayerScores_Player_5PointStreak = []

		// TEAM STREAKS:
		this.sayThis_PlayerScores_Team_MultiplePointStreak = [
			"And another goal by {{team}}"
			,"{{team}} with another goal"
			,"{{team}} sink{{team{s|}}} another one"
			,"{{team}} drop{{team{s|}}} another one"
		]

		this.sayThis_PlayerScores_Team_2PointStreak = [
			 "That's two in a row by {{team}}"
			 ,"{{team}} {{team{is|are}}} on a roll"
			//,"wav:and_another_one.wav"
		];

		this.sayThis_PlayerScores_Team_3PointStreak = [
			"That's three in a row by {{name}}"
			,"{{name}} with another goal. 3 point streak."
			,"And he sinks another one. Three in a row by {{name}}"
			//,"wav:and_another_one.wav"
		];

		this.sayThis_PlayerScores_Team_4PointStreak = []
		this.sayThis_PlayerScores_Team_5PointStreak = []


		// "catch-all"/generic
		this.sayThis_PlayerScores_Player_ScoresPoint = [
			 "{{name}} scores a goal"
			,"{{name}} puts one in"
			,"{{name}} sinks one"
			//,"wav:and_another_one.wav"
		];

		// "catch-all"/generic
		this.sayThis_PlayerScores_Team_ScoresPoint = [
			 "{{team}} score{{team{s|}}} a goal"
			,"{{team}} put{{team{s|}}} one in"
			,"{{team}} sink{{team{s|}}} one"
			//,"wav:and_another_one.wav"
		];

		// "catch-all"/generic
		this.sayThis_PlayerScores_Team_ShutOutAlert = [
			 "And we have a shut out alert for {{other-team}}"
			//,"wav:shut_out_alert.wav"
		];


		// power value high
		//"Power Shot by {{name}}"
		//"{{name}} slams one in"
		//"{{name}} puts one right down the throat of [[defender]]"
		this.sayThis_PlayerScores_Player_HighPowerShot = [
			,"Power Shot from {{name}}"
			,"{{name}} slams one in"
			,"{{name}} slams one down {{other-team-defense}}'s throat"
		]

		this.sayThis_PlayerScores_Player_DefensiveScoreHighPowerShot = [
			,"It's {{name}}! from down town"
			,"{{name}} pounds on {{other-team-defense}} from {the back/the d-fense}"
			,"d-fense, d-fense, d-fense with the score!"
		];

		//TODO
		//	if you are putting in all the points, talk about carrying your team mate

		//  weak "dribble in" shots

		//  it would be really nice to know about fooses

		this.sayThis_PlayerScores_Team_MoreThan2_OtherTeamZero = [
			 "{{team}} {{team{is|are}}} putting the hurt on {{other-team}}"
			 ,"Ouch, {{other-team}} {{other-team{is|are}}} in the danger zone now"
			 ,"{{other-team}} {{other-team{has|have}}} some catching up to do"
		];

		this.sayThis_PlayerScores_ReportScore = [
			 "{We have/Score is} {{team}} with {{team-score}} and {{other-team}} with {{other-team-score}}"
		];

		this.sayThis_PlayerScores_ReportScoreTeamWinning = [
			 "{{team}} {{team{is|are}}} winning {{team-score}} to {{other-team-score}}"
			 ,"It's {{team}} over {{other-team}} with a {{team-score}} to {{other-team-score}} lead."
			 ,"{The Score is/We are at/And it is/We're at/The Score board says} {{team-score}} to {{other-team-score}} with {{team}} {leading the drive/on top/out in front}."
		];

		this.sayThis_PlayerScores_ReportScoreTeamLosing = [
			 "{{team}} {{team{is|are}}} losing {{team-score}} to {{other-team-score}}"
			 ,"It's {{other-team}} over {{team}} with a {{other-team-score}} to {{team-score}} lead."
			 ,"{The Score is/We are at/And it is/We're at/The Score board says} {{other-team-score}} to {{team-score}} with {{other-team}} {leading the drive/on top/out in front}."
			 ,"{The Score is/We are at/And it is/We're at/The Score board says} {{other-team-score}} to {{team-score}} with {{team}} {trailing behind/at the bottom/trying to catch up/needing to gain some points}."
		];

		this.sayThis_PlayerScores_ReportTiedScore = [
			 "Score is tied up at {{team-score}} to {{other-team-score}}"
			 ,"{And we are/The scores are/It's all} tied up at {{team-score}} to {{other-team-score}}"
			 ,"And the scores are at {{team-score}} and {{other-team-score}}"
			 ,"All tied up at {{team-score}} and {{other-team-score}}"
		];

		this.sayThis_PlayerScores_ReportTiedScoreNextPointWins = [
			"{And now/OK boys and girls,} it just got real {{team-score}} to {{other-team-score}}"
			,"{We have/And now it's} fours all around, next point wins"
			,"And fours all around, next point wins"
		]


		// player scores and it took over 2 minutes
		// "Wow, that point took some effort"
		// "That point took some time, {{name}} should get extra points for that shot"



	// Options for annoncing throughout the game
		this.sayThis_NoScoreFor60Seconds = [
			"Someone needs to get a goal in"
			,"Let's see some action"
			//,"wav:boo.wav"
		];

		this.sayThis_NoScoreFor120Seconds = [
			"You need to work for this point"
			//,"wav:boo.wav"
		];


	this.getPlayer = function(oFilter) {
		var matchingPlayer;
		this.config.players.forEach(function(player) {
			//console.log(player)
			//console.log(oFilter)
		    if (player.playerid == oFilter.playerid)
		    	matchingPlayer = player;
		    if (player.color == oFilter.color && player.position == oFilter.position)
		    	matchingPlayer = player;
		});
		return matchingPlayer;
	}

	this.getTeam = function(color, bOtherTeam) {
		var matchingTeam;
		this.config.teams.forEach(function(team) {
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

	this.updateMessageReplacements = function(originalMessage, oPlayer, oTeam, oOtherTeam) {
		var playerName = this.getRandomItem(oPlayer.names);
		var teamName =  oTeam.team;
		var otherTeamName =  oOtherTeam.team;


		var teamEndsInS = (teamName.substr(-1,1) == "s");
		var otherTeamEndsInS = (otherTeamName.substr(-1,1) == "s");

		console.log(teamName, teamName.substr(-1,1), teamEndsInS);
		console.log(otherTeamName, otherTeamName.substr(-1,1), otherTeamEndsInS);

		var msg = originalMessage
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

		// find each set of curly braces
		console.log(msg)
		var aRandomReplacements = msg.match(/{(.*?)}/g);
		if (aRandomReplacements && aRandomReplacements.length > 0) {
			aRandomReplacements.forEach(function(item) {
				var replacements = item.replace("{", "").replace("}", "").split("/");
				msg = msg.replace(item, self.getRandomItem(replacements));
			});
		}
		console.log(msg)

		return msg;
	}

	this.updateStreaks = function(oPlayer, oTeam, oOtherTeam) {
		oPlayer.pointStreak = (oPlayer.pointStreak ? oPlayer.pointStreak+1 : 1);
		oTeam.pointStreak++;
		oOtherTeam.pointStreak = 0;

		this.config.players.forEach(function(player) {
		    if (!(player.color == oPlayer.color && player.position == oPlayer.position))
		    	player.pointStreak = 0;
		});

		if (this.config.debug) console.log(oPlayer);
		if (this.config.debug) console.log(this.config.players);
	}

	this.getRandomItem = function(aData) {
		return aData[Math.floor(Math.random()*aData.length)];
	}

	this.ScorePoint = function(oPlayer, gameTime) {
		var oPlayer    = this.getPlayer(oPlayer);
		var oTeam      = this.getTeam(oPlayer.color);
		var oOtherTeam = this.getTeam(oPlayer.color, true);

		//if (this.config.debug) console.log("oTeam", oTeam);
		//if (this.config.debug) console.log("oOtherTeam", oOtherTeam);
		this.updateStreaks(oPlayer, oTeam, oOtherTeam);
		
		// update team score
		oTeam.score++;

		// array to be used to load random options of messages
		var sayThisOptions = [];
		var sayThisAlsoOptions = [];

		// if this is the first point of the game
		if (this.pointHistory.length == 0) {
			sayThisOptions = sayThisOptions.concat(this.sayThis_PlayerScores_Game_FirstPoint);
		} 

		// STREAKS!!!
		// If a player is streaking, note that FIRST
		if (oPlayer.pointStreak >= 2) {

			if (oPlayer.pointStreak >= 5) {
				sayThisOptions = sayThisOptions.concat(this.sayThis_PlayerScores_Player_5PointStreak);
			} else if (oPlayer.pointStreak >= 4) {
				sayThisOptions = sayThisOptions.concat(this.sayThis_PlayerScores_Player_4PointStreak);
			} else if (oPlayer.pointStreak >= 3) {
				sayThisOptions = sayThisOptions.concat(this.sayThis_PlayerScores_Player_3PointStreak);
			} else {
				sayThisOptions = sayThisOptions.concat(this.sayThis_PlayerScores_Player_2PointStreak);
				sayThisOptions = sayThisOptions.concat(this.sayThis_PlayerScores_Player_MultiplePointStreak);
			}
		} else 
		// If a teams is streaking, note that SECONDARILY
		if (oTeam.pointStreak >= 2) {

			if (oTeam.pointStreak >= 5) {
				sayThisOptions = sayThisOptions.concat(this.sayThis_PlayerScores_Team_5PointStreak);
			} else if (oTeam.pointStreak >= 4) {
				sayThisOptions = sayThisOptions.concat(this.sayThis_PlayerScores_Team_4PointStreak);
			} else if (oTeam.pointStreak >= 3) {
				sayThisOptions = sayThisOptions.concat(this.sayThis_PlayerScores_Team_3PointStreak);
			} else {
				sayThisOptions = sayThisOptions.concat(this.sayThis_PlayerScores_Team_2PointStreak);
				sayThisOptions = sayThisOptions.concat(this.sayThis_PlayerScores_Team_MultiplePointStreak);
			}
		}

		console.log(oTeam.score, oOtherTeam.score)

		if (oOtherTeam.score == 0) {
			if (oTeam.score == 4) {
				// empty any previous entries, this is imporant :)
				sayThisOptions = this.sayThis_PlayerScores_Team_ShutOutAlert;
			} else if (oTeam.score >= 2) {
				sayThisOptions = this.sayThis_PlayerScores_Team_MoreThan2_OtherTeamZero;
			}
		} else if (oOtherTeam.score + oTeam.score >= 3) {
			// let's also announce the score
			// score is tied up
			console.log("oOtherTeam.score == oTeam.score", oOtherTeam.score == oTeam.score)
			if (oOtherTeam.score == oTeam.score) {
				if (oOtherTeam.score == 4) {
					sayThisAlsoOptions = this.sayThis_PlayerScores_ReportTiedScoreNextPointWins;
				}
			} else {
				sayThisAlsoOptions = this.sayThis_PlayerScores_ReportScore;
				if (oTeam.score > oOtherTeam.score)
				{
					sayThisAlsoOptions = sayThisAlsoOptions.concat(this.sayThis_PlayerScores_ReportScoreTeamWinning);
				} else {
					sayThisAlsoOptions = sayThisAlsoOptions.concat(this.sayThis_PlayerScores_ReportScoreTeamLosing);
				}
			}
		}


		// if there is nothing else, use the defaults
		if (sayThisOptions.length == 0) {
			sayThisOptions = sayThisOptions.concat(this.sayThis_PlayerScores_Player_ScoresPoint);
			sayThisOptions = sayThisOptions.concat(this.sayThis_PlayerScores_Team_ScoresPoint);
		}

		var message = this.getRandomItem(sayThisOptions);
		var alsoMessage;
		console.log("sayThisAlsoOptions.length", sayThisAlsoOptions.length)
		if (sayThisAlsoOptions.length > 0) {
			alsoMessage = this.getRandomItem(sayThisAlsoOptions);			
		}
		var returnMessage
		message     = this.updateMessageReplacements(message,     oPlayer, oTeam, oOtherTeam)
		returnMessage = message;
		if (alsoMessage) {
			alsoMessage = this.updateMessageReplacements(alsoMessage, oPlayer, oTeam, oOtherTeam)
			returnMessage = returnMessage +". "+ alsoMessage; 
		}

		// add to point history array
		this.pointHistory.push({ "player": oPlayer, "time": gameTime});


		this.sayThis(message, alsoMessage);

		// return to user
		return { "message":returnMessage };
	}

	this.sayThis = function(message, alsoMessage) {
		//alert(this.config.useTTS)
		if (this.config.useTTS) {
			if (this.config.debug) console.log("sayThis: ", message);
			var audio = new Audio();
			audio.src ='http://translate.google.com/translate_tts?ie=utf-8&tl=en&q='+ escape(message);
			audio.play();
			if (alsoMessage) {
				audio.addEventListener("ended", function() {
		          	audio.currentTime = 0;
					var audio2 = new Audio();
					audio2.src ='http://translate.google.com/translate_tts?ie=utf-8&tl=en&q='+ escape(alsoMessage);
					audio2.play();
			     });
			}
		}
	}

	this.init = function() {
		// init teams
		this.config.teams.forEach(function(team) {
			team.score = 0;
			team.pointStreak = 0;
		});
	}

	// initialize
	this.init();
};

/*
	New Game
	Play intro music...
	play low crowd sound...

	"Welcome to the BizStream areana on this gloomy Monday afternoon. Today's matchup is  going to be a great one. Albert's team  should be able to win this game with ease. It will be an uphill battle for the Yellow Team.


	"{Welcome to the/And we will start things off at/Our game today} {BizStream Areana/BizStream Plex/Biz Plex/BizStream Warehouse} on this {{day-description}} {{time-of-day}} for a great {match-up/game}

	"Welcome to game 3 in this tough battle for a victory. 

	{{day-description}} = get current weather/zipcode
	rain = rainy, wet, dreary
	clouds = gloomy, cloudy, overcast
	sun = beautiful, sunny

	temp below 15 = cold, freezing, 
	temp above 70 = warm, comfortable
	temp above 85 = scorching, hot, sweaty

	{{time-of-day}} = Monday Afternoon, Friday Evening, Lunchtime, post-company meeting


	TODO:
	Game init... SeriesGameCount: 1-3

	on the score add {"power": 1-3} weak, avg, power

	{{name}} could also randomly be replaced with "Dream Team's D-fense", "The D-Fense", "The Yellow Team's defense"

	{{defense/offense}} replaced with the player's position
	{{defensive/offensive}} replaced with the player's position

*/
