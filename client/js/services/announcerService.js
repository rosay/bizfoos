// TO DO
// deal with allowMultiple's 
// player Gender
// player NickNames
// Team Names
// get random music, keep track of previous plays ,get something we haven't played in a while. on reset, make sure this array gets cleared

// announce player positions and the home team (yellow) and the away team (black)

// todo: simulate noise levels

//  GameUpdates: if one team is 1 point away from winning, crowd gets crazy
//  GameUpdates: if tied up and 1 point away from winning, crowd gets even crazier

// BUG: When restoring the volume.... if the song was fading out, we are kicking it up... then it never stops.. 
//     FIX: we should NOT restore the volume of a fading out song.

//app.factory('announcerService', ['randomService', function announcerService (random) {
//app.factory('announcerService', ['random', 'soundDataService', function announcerService (random, soundsToMake) {
app.factory('announcerService', ['sayThisDataService', 'soundDataService', function announcerService (sayThisDataService, soundDataService) {
	"use strict";

	var GAME_UPDATE_CHECK_EVERY_X_MILIS = 7000;

	// todo: treat these as a service, along with random, talk to Cody
	var soundsToMake = soundDataService;
	var thingsToSay = sayThisDataService;

	var soundRootPath = "sounds/"
	if (window.location.protocol == "file:") soundRootPath = "../../../sounds/";
		
	var 	config = {
		"pointsNeededToWin": 5,
		"series:": 1,
		"useTTS": true,
		"skipIntro": false,
		"playMusic": true,
		"delayBetweenSongs": 90, // 90 seocnds
		"debug": false		
	};

	var weather = {
		condition: "",
		temperature: 42,
		wind: 42
	}

	var stadiumTimers = {
		GameUpdates : null, // just a timer/interval that we can turn on or off if needed

		stopAll : function() {
			for (var tmr in this) {
				var thisTimer = this[tmr];
				if (thisTimer != null)
					try { 
						clearInterval(thisTimer);
					} catch(err) {
						clearTimeout(thisTimer);
					};
			}
		}
	}


	var crowdControl = {
		minVolume : .0075,
		maxVolume : .55,

		audioElement : null,
		audioApplause : null,
		startCrowd: function() {
			var crowd = getSoundFile(soundsToMake.bg.crowd);
			if ($("#bgCrowdAudio").length == 0) {
				$("body").append('<audio id="bgCrowdAudio" loop="loop" src="'+ crowd.file +'"></audio>')
				$("body").append('<audio id="fgApplauseAudio" loop="loop" src=""></audio>')
			}
			crowdControl.audioElement = document.getElementById("bgCrowdAudio");
			crowdControl.audioElement.volume = crowdControl.minVolume;
			crowdControl.audioElement.play();

			crowdControl.audioApplause = document.getElementById("fgApplauseAudio");
		},
		stopCrowd: function() {
			$("#bgCrowdAudio").remove();
		},
		playApplause: function(soundType, volumeLevel) {
			playSound(soundType, {vol: volumeLevel});
		},
		ensureSafeVolume: function(level, min) {
			if (level < min) level = min;
			if (level > crowdControl.maxVolume) level = crowdControl.maxVolume;
			return level
		},
		getPercentOfMaxVolume: function(pct) {
			return (pct * crowdControl.maxVolume);
		},
		getVolume: function() { return (crowdControl.audioElement ? crowdControl.audioElement.volume : 0); },
		setVolume: function(level) {
		    debug("crowdControl.audioElement.volume:pre  = "+ crowdControl.audioElement.volume);
		    //crowdControl.audioElement.volume = crowdControl.ensureSafeVolume(level, .05);
		    $(crowdControl.audioElement).animate({volume: crowdControl.ensureSafeVolume(level, crowdControl.minVolume)}, 750, function() {
		    	debug("crowdControl.audioElement.volume:post = "+ crowdControl.audioElement.volume);
		    });
		    
		},
		adjustVolume: function(changeBy) {
			var changeTo = crowdControl.audioElement.volume + changeBy;
		 	debug("adjustVolume "+ changeBy + " == "+ changeTo);
		    crowdControl.setVolume(changeTo);
		},
		randomAdjustment: function() {
			//var adjustTo = (Math.random() - .4) * .1; // add a random value between -.04 to +.06 (technically, should always be moving up...)
			// make the crowd change less
			//var adjustTo = ((Math.random() - .4) * .1) / 2; // add a random value between -.02 to +.03 (technically, should always be moving up...)
		 	var adjustTo =  random.getFromRange(-.002, .003); // add a random value between -.002 to +.003 (technically, should always be moving up...)
		 	crowdControl.adjustVolume(adjustTo);
		},
		fadeOut: function(delay, callback) {
			$("#bgCrowdAudio").animate({ volume: 0 }, delay, callback)
		}
	}

	var pointHistory = [];
	var teamScores = {};

	// Functions

	var getPlayer = function(oFilter) {
		var matchingPlayer;
		config.players.forEach(function(player) {
		    if (player.color == oFilter.color && player.position == oFilter.position)
		    	matchingPlayer = player;
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
				else if (/cloud/.test(c.description)) cond.push("partly cloudy"); 
				else if (/clear sky/.test(c.description)) cond.push("sunny");
				else if (/heavy.*snow/.test(c.description)) cond.push("riduclusly snowy");
				else if (/snow/.test(c.description)) cond.push("snowy");
				else if (/sleet/.test(c.description)) cond.push("nasty");
				else if (/heavy.*rain/.test(c.description)) cond.push("riduclusly rainy/riduclusly wet");
				else if (/rain/.test(c.description)) cond.push("rainy/wet");
				else if (/drizzle/.test(c.description)) cond.push("wet");
				else if (/thunderstorm/.test(c.description)) cond.push("stormy");
			});

			//debug(cond)
			cond = "{"+ cond.join("/") +"}";
		}
		if (cond != "") cond = ", "+ cond;

		// cold, windy, wet
		// warm, sunny
		// cold
		// if both have a value...
		if (temp != "" && cond != "") {
			if (random.chance(.5))
				return (temp + cond);
			else if (random.chance(.5))
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
			playerName = random.getItem(oValues.oPlayer.names, false);
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

		//debug(teamName, teamName.substr(-1,1), teamEndsInS);
		//debug(otherTeamName, otherTeamName.substr(-1,1), otherTeamEndsInS);

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

		//debug('Prefiltered Message: ' + msg)
		// find each set of curly braces
		var aRandomReplacements = msg.match(/{(.*?)}/g);
		if (aRandomReplacements && aRandomReplacements.length > 0) {
			aRandomReplacements.forEach(function(item) {
				var replacements = item.replace("{", "").replace("}", "").split("/");
				//debug('Replacement Messages: ' + replacements)
				msg = msg.replace(item, replacements[ random.getIntFromRange(0, replacements.length-1) ]);
			});
		}

		//debug('Message: ' + msg)



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

	var initPlayersAndTeamViaRoster = function () {
		//TODO: Cody, there may be some fixing needed here to get the roster lined up properly
		config.teams = [
				{
					"color": "black",
					"team": "The Black Team"
					//"probabilty": .80
				},
				{
					"color": "yellow",
					"team": "The Yellow Team"
					//"probabilty": .20
				}
		];
		config.players = [
			{	//0
				"playerid": config.roster.teamBlack.offense._id,
				"color": "black",
				"position": "o",
				"team": "The Black Team",
				"names": createNameList(config.roster.teamBlack.offense)
			},
			{	//1
				"playerid": config.roster.teamBlack.defense._id,
				"color": "black",
				"position": "d",
				"team": "The Black Team",
				"names": createNameList(config.roster.teamBlack.defense)
			},
			{	//2
				"playerid": config.roster.teamYellow.offense._id,
				"color": "yellow",
				"position": "o",
				"team": "The Yellow Team",
				"names": createNameList(config.roster.teamYellow.offense)
			},
			{	//3
				"playerid": config.roster.teamYellow.defense._id,
				"color": "yellow",
				"position": "d",
				"team": "The Yellow Team",
				"names": createNameList(config.roster.teamYellow.defense)
			}
		] // end array of peole
	}

	var createNameList = function(playerFromRoster) {
		var aryNames = [];
		// if no first and last name.... make em....
		if (!(playerFromRoster.firstName && playerFromRoster.lastName)) {
			var aNames = playerFromRoster.name.split(" ", 2);
			playerFromRoster.firstName = aNames[0];
			playerFromRoster.lastName  = aNames[1];
		}
		aryNames.push(playerFromRoster.firstName);
		aryNames.push(playerFromRoster.lastName);

		if (playerFromRoster.nicknames) {
			playerFromRoster.nicknames.split(",").forEach(function(n) {
				aryNames.push($.trim(n));
			});
		}

		debug(playerFromRoster);
		debug(aryNames);
		return aryNames;
	}

	var setTeamName = function(color, players) {
		var pOffense = getPlayer({color: color, position: "o"});
		var pDefense = getPlayer({color: color, position: "d"});

		var returnTeamName = "The "+ color +" Team";
        if (config.teamNames) {
	        config.teamNames.forEach(function(st) {
				if (st.players.indexOf(pOffense.playerid) >= 0 && st.players.indexOf(pDefense.playerid) >= 0) {
					returnTeamName = st.name;
					return;
				}
			});
   	 	}

		return returnTeamName;
	}

	var endGame = function() {
		crowdControl.setVolume(.1)
		var secsSinceLastSongPlayed = getSecondSince(config.timeLastSongWasPlayed);
		console.log("MUSIC: secsSinceLastSongPlayed = ", secsSinceLastSongPlayed, 45);
		if (secsSinceLastSongPlayed > 45) {
			playSound(soundsToMake.music.finalPoint, {vol: 1});
		}
		stadiumTimers.endGame1 = setTimeout(function() { playSound([soundsToMake.positiveCrowd.cheer, soundsToMake.positiveCrowd.chant]); }, 1000);
		//stadiumTimers.endGame2 = setTimeout(function() { playSound([soundsToMake.positiveCrowd.cheer, soundsToMake.positiveCrowd.chant]); }, 8000);
		stadiumTimers.endGame3 = setTimeout(function() {
			//playSound([soundsToMake.positiveCrowd.cheer, soundsToMake.positiveCrowd.chant]);
			crowdControl.fadeOut(30000, stopGame);
		}, 5000)
	}

	var stopGame = function() {
		crowdControl.stopCrowd();
		stadiumSounds.stopAll();

		// clear all timers
		stadiumTimers.stopAll();

		//stop all "animations" volume changes
		$("audio").stop(true, false);
		$("audio").remove();
		
		// stop talking
		window.speechSynthesis.cancel();
		//window.speechSynthesis.pause();

		//reset "get random item array"
		
		random.reset();
		debug("GAME OVER!!!!!!!!!!!!!");
	}

	var resetGame = function() {
		random.init();
		stopGame();

		config.gameStartTime = new Date();
		config.timeLastGoalWasScored = config.gameStartTime;
		config.timeLastAnnouncementWasMade = config.gameStartTime;
		config.timeLastSongWasPlayed = config.gameStartTime;

		resetPlayersAndTeams();

	}

	var resetPlayersAndTeams = function() {
		if (config.teams) {
			config.teams.forEach(function(team) {
				team.score = 0;
				team.pointStreak = 0;
				team.timeLastGoalWasScored = config.gameStartTime;
				team.team = setTeamName(team.color, config.players)
			});
		}

		if (config.players) {
			config.players.forEach(function(player) {
				player.score = 0;
				player.pointStreak = 0;
				player.timeLastGoalWasScored = config.gameStartTime;
			});
		}
	}

	var newGame = function(c) {
		resetGame();

		console.log(typeof config.roster == "object")
		if (typeof config.roster == "object") {
			//alert("INIT THE NEW WAY");
			initPlayersAndTeamViaRoster();
		}
		resetPlayersAndTeams();

		// do sound effects
		crowdControl.startCrowd();
		
		// 1/3 of the time.
		if (random.chance(.333)) {
			// this will play until the first thing is said...
			playSound(soundsToMake.music.letsGetReadyToRumble);
			//after 15-30 seconds drop the volume
			stadiumTimers.lowerReadyToRumbleTimer1 = setTimeout(function() {
				debug("lowering the volume")
				if (stadiumSounds.intro.isPlaying) { // if intro is still playing...
					$(stadiumSounds.intro.audioElement).animate({volume: 0.2}, 3000);
				}
			}, 7000);
			stadiumTimers.lowerReadyToRumbleTimer2 = setTimeout(function() {
				debug("lowering the volume")
				if (stadiumSounds.intro.isPlaying) { // if intro is still playing...
					$(stadiumSounds.intro.audioElement).animate({volume: 0.1}, 3000);
				}
			}, random.getFromRange(15000, 30000));
			stadiumTimers.startGameTimerSoon = setTimeout(startGameUpdateTimer, 10000);
		} else {
			if (!config.skipIntro)
				playSound(soundsToMake.music.intro);

			// give it a small delay to the the intro play
			if (!config.skipIntro)
				stadiumTimers.openingMessage = setTimeout(speakOpeningMessage, 5000);
		}
	}

	var startGameUpdateTimer = function() {
		stadiumTimers.GameUpdates = setInterval(giveGameUpdates, GAME_UPDATE_CHECK_EVERY_X_MILIS);
	}

	var speakOpeningMessage = function() {
		// can't make the welcome announcement until we load the weather data
		updateLocalEnviromentInfo(function(){
			// when all of the local enviroment info is updated, now we can start the game
			var message = random.getItem(thingsToSay.newGame.intro);
			message     = updateMessageReplacements(message, {})
			sayThis(message);

			//todo, also announce player positions and team names and colors/sides
			message = random.getItem(thingsToSay.newGame.teamsAndPlayersIntro);
			debug(getPlayer({"color": "yellow", "position": "o"}))
			message = updateMessageReplacements(message, {
				// yellow-team, black-team, yellow-d, yellow-o, black-d, black-o
				"yellow-team": getTeam("yellow").team,
				"yellow-o": random.getItem(getPlayer({"color": "yellow", "position": "o"}).names),
				"yellow-d": random.getItem(getPlayer({"color": "yellow", "position": "d"}).names),
				"black-team": getTeam("black").team,
				"black-o": random.getItem(getPlayer({"color": "black", "position": "o"}).names),
				"black-d": random.getItem(getPlayer({"color": "black", "position": "d"}).names),
			});

			// split by ". " 
			message.split(". ").forEach(function(m) {
				sayThis(m);
			})

			startGameUpdateTimer();
		});
	}

	var getSecondSince = function(dateSinceWhen) {
		var now = new Date();
		return (now.getTime() - dateSinceWhen.getTime()) / 1000;
	}

	var giveGameUpdates = function() {
		if (stadiumSounds.music.isPlaying) {
			debug("exit giveGameUpdates: "+ stadiumSounds.music.isPlaying);
			return; //exit
		}

		var secondsSinceLastAnnouncement = getSecondSince(config.timeLastAnnouncementWasMade);
		if (secondsSinceLastAnnouncement > 15) {
			var secondsSinceLastScore = getSecondSince(config.timeLastGoalWasScored);
			debug("seconds since last goal: "+ secondsSinceLastScore);
			
			var say = new WeightedOptions();
			var bLetSeeSomeAction          = (secondsSinceLastScore > 60);
			var bLetSeeSomeActionAllowBoos = (secondsSinceLastScore > 120);

			if (config.teams[0].score == config.teams[1].score && secondsSinceLastAnnouncement > 60) {
				// all tied up
				//TODO: Make this happen
				say.addOptions(1, thingsToSay.gameUpdates.stillTiedUp);
			}

			if (secondsSinceLastScore > 120)  {
				say.addOptions(1, thingsToSay.gameUpdates.noScoreFor120Seconds);
			} else if (secondsSinceLastScore > 60)  {
				say.addOptions(1, thingsToSay.gameUpdates.noScoreFor60Seconds);
			}
			if (say.hasOptions()) {
				
				if (bLetSeeSomeAction && random.chance(.8)) {
					// don't do it every single time
					if (random.chance(.4)) {
						if (random.chance(.6)) {
							// play charge sound
							playChargeSound(bLetSeeSomeActionAllowBoos, false);
						} else {
							// play pump up the table music
							playSound(soundsToMake.music.someoneDoSomethingNow);
						}
					}
				} else {
					var msg = say.getRandomOption();;
					msg = updateMessageReplacements(msg, {
						 "winning-score": config.teams[0].score
						,"losing-score": config.teams[0].score
					});
					doThis(msg);
				}
			}


		}
		// goal -.04 to .06
		crowdControl.randomAdjustment();
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
				debug("I AM AN OBJECT WITH ARRAYS")
				debug(whichSound)
				if (whichSound.file) {
					aryChooseFrom.push(whichSound);
				} else {
					for (var key in whichSound) {
						aryChooseFrom = aryChooseFrom.concat(whichSound[key]);
					}
				}
			}
			// get randome Item
			if (aryChooseFrom.length > 1)
				fileName = random.getItem(aryChooseFrom, true);
			else
				fileName = aryChooseFrom[0];
		} else {
			switch (whichSound) {
				// http://soundbible.com/tags-crowd.html
				//case "intro": 	 fileName = "intro.wav"; break;
				// /case "crowd": 	 fileName = "crowd.wav"; break;
				//case "applause": fileName = 'applause-' + (Math.floor(Math.random() * 5) + 1 )+ '.wav'; break;; break;
				//case "boo": 	 fileName = 'boo-' + (Math.floor(Math.random() * 5) + 1 )+ '.wav'; break;; break;
				//case "charge": 	 fileName = 'cheering-charge-' + (Math.floor(Math.random() * 1) + 1 )+ '.wav'; break;; break;
				//case "end": 	 fileName = 'end-of-game-' + (Math.floor(Math.random() * 1) + 1 )+ '.wav'; break;; break;
				//case "score": 	 fileName = 'score-' + (Math.floor(Math.random() * 6) + 1 )+ '.mp3'; break;
				//case "win": 	 fileName = 'win-' + (Math.floor(Math.random() * 1) + 1 )+ '.mp3'; break;
				default: fileName = whichSound;
			}
		}
		if (typeof fileName == "string") {
			debug("getSoundFile: "+ fileName); 
			return soundRootPath + fileName;
		} else {
			var returnThis = {
				file: soundRootPath + fileName.file,
				type: fileName.type,
				vol: fileName.vol,
				volstart: fileName.volstart,
				fade: fileName.fade,
				start: fileName.start,
				end: fileName.end
			}
			debug("getSoundFile:"); 
			debug(returnThis);
			return returnThis;
		}
	}

	var stadiumSounds = {
		intro: { allowMultiple: false, isPlaying : false, audioElement: null },
		score: { allowMultiple: false },
		music: { allowMultiple: false, isPlaying : false, audioElement: null },
		organ: { allowMultiple: false, isPlaying : false, audioElement: null },
		cheer: { allowMultiple: true },
		fx:    { allowMultiple: true },
		
		fadeOut : function(whichChannel, delay) {
			var thisChannel = this[whichChannel];
			if (thisChannel.isPlaying && thisChannel.audioElement) {
				$(thisChannel.audioElement).attr("data-allow-volume-change", 0)
				$(thisChannel.audioElement).animate({volume: 0}, delay, function() {
					thisChannel.isPlaying = false;
					thisChannel.audioElement = null;
				});
			}
		},
		stop : function(whichChannel) {
			var thisChannel = this[whichChannel];
			if (thisChannel.audioElement != null) {
				thisChannel.audioElement.pause();
				$(thisChannel.audioElement).remove();
				thisChannel.audioElement = null;
			}
			thisChannel.isPlaying = false;
		},
		stopAll : function() {
			for (var sound in this) {
				this.stop(sound);
			}
		}
	}

	var SoundSettings = function() {
		this.file = "";
		this.fade = false;
		this.volstart = 0;
		this.vol = 1;
		this.start = 0;
		this.end = null;

		this.getEndOfSong = function() {
			if (this.end == 0) return 0;
			var endAfter = this.end;
			// put a little variation into it
			if (endAfter > 10000 && endAfter < 20000) // if between 10-20 seconds, let's make the length variable
				endAfter = endAfter + random.getFromRange(-1000, 6000); //So, we are going to -1 or +6 seconds
			return endAfter;
		}
	}

	var playSound = function(soundType, settingsParam) {
		var playThisFile = getSoundFile(soundType);

		var settings = new SoundSettings();

		//debug("playThisFile:");
		//debug(playThisFile);
		if (typeof playThisFile == "string") {
			// it's just a file path
			settings.file = playThisFile; 
		} else if (typeof playThisFile == "object") {
			// it's a full object
			settings = MergeRecursive(settings, playThisFile); 
		}

		if (settingsParam) {
			//debug("settingsParam:");
			//debug(settingsParam);
			settings = MergeRecursive(settings, settingsParam); 
			//debug(settings);
		}

		if (!config.playMusic && settings.type == "music") {
			// BAIL
			return;
		}

		//debug("final settings:");

		//debug(stadiumSounds.intro);
		//debug(settings.type +" = "+ stadiumSounds[settings.type]);
		if (settings.type) {

			if (settings.type == "music") {
				config.timeLastSongWasPlayed = new Date();
				console.log("config.timeLastSongWasPlayed", config.timeLastSongWasPlayed)
			}


			if (stadiumSounds[settings.type].allowMultiple) {
				var aId = ['a','b','c','d','e','f',0,1,2,3,4,5,6,7,8,9]
				settings.audioId = "audio_"+ settings.type + "_"+ random.getItem(aId) + random.getItem(aId);
			} else {
				settings.audioId = "audio_"+ settings.type;
				if (stadiumSounds[settings.type].isPlaying) {
					//bail
					// if the current song is about to end, THEN queue it, otherwise, bail
					debug("currentTime: "+ stadiumSounds[settings.type].audioElement.currentTime)
					if (stadiumSounds[settings.type].audioElement.currentTime > 10) {
						debug("NOT GOING TO PLAY THIS SONG... busy playing something else...")
						// try again in 4 seconds? This is questionable, Not sure if I want to do this, might get out of control
						//stadiumTimers.queueSongForLater = setTimeout(function() { playSound(soundType) }, 2000);
					}
					return false;
				}
				stadiumSounds[settings.type].isPlaying = true;
			}
		}


		//set defaults
		settings.vol = (settings.vol ? settings.vol : 1);
		console.log("settings.file", settings.file);
		console.log(settings);

		//var sound = new Audio(playThisFile);
		var sound = document.createElement('audio');
		sound.src = settings.file;
		if (settings.start > 0) {
			sound.currentTime = (settings.start/1000);
		}
		if (settings.fade) {
			sound.volume = (settings.volstart ? settings.volstart : 0);
			sound.play();
			$(sound).animate({volume: settings.vol}, random.getFromRange(750, 2750));
		} else {
			sound.volume = settings.vol;
			sound.play();
		}

		// if NOT allowMultiple, then manage the isPlaying Bit
		if (!stadiumSounds[settings.type].allowMultiple) {
			sound.addEventListener('ended', function() {
				stadiumSounds[settings.type].isPlaying = false;
			});
		}

		debug("volume = "+ sound.volume);

		// save this volume as the MAX volume
		$(sound).attr("data-allow-volume-change", 1)
		$(sound).attr("data-max-vol", sound.volume);
		$(sound).attr("id", settings.audioId);
		$(sound).attr("class", settings.type);

		// if music is playing, and we can talk, we can fade it out later
		if (settings.type) {
			debug(settings.type)
			stadiumSounds[settings.type].audioElement = sound;
		}

		var endAfter = settings.getEndOfSong();
		console.log("endAfter", endAfter)
		if (endAfter > 0) {
			setTimeout(function() { 
				stadiumSounds.fadeOut(settings.type, random.getFromRange(1000, 3000));
			},  endAfter);
		}

		// add to body to make my life easier
//		if ($("#"+ settings.audioId).length) {
//			$("#"+ settings.audioId).replace(sound);
//		} else {
			$("body").append(sound);
//		}

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
			stadiumTimers.queueChargeForLater = setTimeout(playCharge, random.getFromRange(5000, 20000));
		else
			playCharge();
	}

	var setPointScoredActions = function(oPlayer, oTeam, oOtherTeam) {
		// create default action structure
		var actions = {
			player: {
				score: false,
				onfire: false,
				firstPoint: false,
				streak : 0,
				timeSinceLastPoint: {
					shortTime: false
				}
			},
			team: {
				home: false, 
				away: false, 
				winning: false,
				losing: false,
				score: false,
				firstPoint: false,
				nextPointWins: false,
				onfire: false,
				streak : 0,
				shutout: {
					approaching: false,
					alert: false
				},
				comeback: {
					cacthup: false

				},
				tie: {
					broken: false
				},
				timeSinceLastPoint: {
					longTime: false,
					shortTime: false
				}
			},
			otherTeam: {
				nextPointWins: false
			},
			game: {
				firstPoint: false
				,over: false
				,stillGoing: false
				,middleOfGame: false
				,tied: false
				,nextPointWins: false
				,finalScore: {
					 shutout: false
					,blowout: false
					,close: false
				}
			},
		}

		// Time to set the actions based on the data
		// points for shut out warning...
		var closeMatchPoints = (config.pointsNeededToWin - 1); // eventually should be a percentage

		// use the last score time
		var timeSinceLastGoalTeam   = getSecondSince(oTeam.timeLastGoalWasScored)
		var timeSinceLastGoalPlayer = getSecondSince(oPlayer.timeLastGoalWasScored)

		if (timeSinceLastGoalTeam < 20)  actions.team.timeSinceLastPoint.shortTime = true;
		if (timeSinceLastGoalTeam > 120) actions.team.timeSinceLastPoint.longTime = true;
		if (timeSinceLastGoalPlayer < 20)  actions.player.timeSinceLastPoint.shortTime = true;

		if (oTeam.color == "yellow") actions.team.home = true;
		if (oTeam.color == "black")  actions.team.away = true;

		actions.game.over       = (oTeam.score == config.pointsNeededToWin); 
		actions.game.stillGoing = (oTeam.score < config.pointsNeededToWin); 

		actions.player.streak = oPlayer.pointStreak;
		actions.team.streak   = oTeam.pointStreak;

		debug("Scores: " + oTeam.score + ", " + oOtherTeam.score)
		if (actions.game.over) {
			if (oOtherTeam.score == 0) {
				actions.game.finalScore.shutout = true;
			} else if (oOtherTeam.score == closeMatchPoints) {
				actions.game.finalScore.close = true;
			} else if (oOtherTeam.score <= 2) { // eventually a percentage (less than half)
				actions.game.finalScore.blowout = true;
			}
		}


		if (oOtherTeam.score + oTeam.score >= 3) {
			actions.game.middleOfGame = true;
		}

		if (oTeam.score == closeMatchPoints) actions.team.nextPointWins = true;
		if (oOtherTeam.score == closeMatchPoints) actions.otherTeam.nextPointWins = true;

		// score is tied up
		debug("oOtherTeam.score == oTeam.score =>", oOtherTeam.score == oTeam.score)
		// if it is tied up
		if (oOtherTeam.score == oTeam.score) {
			actions.game.tied = true;
			if (oOtherTeam.score == closeMatchPoints) actions.game.nextPointWins = true;
		} else if (oTeam.score > oOtherTeam.score) {
			actions.team.winning = true;
		} else {
			actions.team.losing = true;
		}

		// 2 quick points by the same player
		if (actions.player.streak >= 2 && actions.player.timeSinceLastPoint.shortTime) {
			actions.player.onfire = true;
		}

		// 2 quick points by the same team
		if (actions.team.streak >= 2 && actions.team.timeSinceLastPoint.shortTime) {
			actions.team.onfire = true;
		}
		if (oOtherTeam.score == 0) {
			if (actions.team.nextPointWins) {
				actions.team.shutout.alert = true;
			} else if (oTeam.score >= 2) {
				// 2 - 0 or more, working on a shut out
				actions.team.shutout.approaching = true;
			} 
		}

		// if the home team just score, yet still behind...
		if (actions.team.home && oTeam.score < oOtherTeam.score) {
			actions.team.comeback.cacthup = true;
		} 

		if (oOtherTeam.score != 0 && oOtherTeam.score == (oTeam.score + 1)) {
			actions.team.tie.broken = true;
		}

		// if this is the first point of the team or game
		if (oTeam.score == 1) {
			if (oOtherTeam.score == 0) {
				actions.game.firstPoint = true;
			} else {
				actions.team.firstPoint = true;
			}
			if (oPlayer.score == 1) {
				actions.player.firstPoint = true;
			}
		}

		return actions;
	}

	var WeightedOptions = function() {
		this.self = this;
		this.optionList = [];
		
		this.addOptions = function(weight, arrayOfOptions) {
			// based on the weight, it will add it to the array that many times
			for (var x = 0; x < weight; x++) {
				if (arrayOfOptions && arrayOfOptions.length > 0) {
					this.optionList = this.optionList.concat(arrayOfOptions);
				}
			}
		}

		this.hasOptions = function() {
			if (this.optionList.length > 0) return true;
			return false;
		}

		this.getRandomOption = function() {
			//this.optionList.sort().forEach(function(item) {
			//	console.log(item);
			//});
			return random.getItem(this.optionList);
		}

		this.clearOptions = function() {
			this.optionList = [];
		}
	}

	var scorePoint = function(oPlayer, gameTime) {
		var oPlayer    = getPlayer(oPlayer);
		var oTeam      = getTeam(oPlayer.color);
		var oOtherTeam = getTeam(oPlayer.color, true);

		oTeam.score++;   // update team score
		oPlayer.score++; // update player score


		updateStreaks(oPlayer, oTeam, oOtherTeam);

		var doThisAfterwards;

		// fake a random volumne
		//var gameCompleteMessageDelay = 0;
		var shotPowerLevel = crowdControl.ensureSafeVolume(crowdControl.getPercentOfMaxVolume( random.getFromRange(.25, 1) ), crowdControl.audioElement.volume)
		debug(shotPowerLevel)

		//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
		var actions = setPointScoredActions(oPlayer, oTeam, oOtherTeam);

		// now we can reset the last score time
		config.timeLastGoalWasScored = new Date(); // update last point
		oTeam.timeLastGoalWasScored = config.timeLastGoalWasScored;
		oPlayer.timeLastGoalWasScored = config.timeLastGoalWasScored;

		// add to point history array
		pointHistory.push({ "player": oPlayer, "time": gameTime});

		//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
		// array to be used to load random options of messages
		var playMusicAfterTalking;
		var delayBetweenSongs = config.delayBetweenSongs;

		var say = new WeightedOptions();
		var sayAlso = new WeightedOptions();

		var playAwesomeMusic = true;
		if (actions.team.timeSinceLastPoint.longTime) {
			// FINALLY SOMEONE SCORED, even if it is the away team, it's ok, ...
			playAwesomeMusic = true;
		} 

		// TODO: weighted random.... I'd like to weight On fires heavier, then do random based on that
		if (actions.game.stillGoing) {
			var turnCrowdUpBy = 0;
			playSound(soundsToMake.fx.score);

			if (actions.team.home) {
				crowdControl.playApplause(soundsToMake.positiveCrowd, shotPowerLevel); //FUTURE: Pass level 0-1 based on strength of shot
				turnCrowdUpBy = crowdControl.getPercentOfMaxVolume(0.1);
				// occasionally, play another random sound
				if (random.chance(.2)) {
					//10 to 20 seconds in the future. Eventually I want this to work with loud hits againts the wall, but for now, random FTW
					stadiumTimers.queuePositiveCrowd = setTimeout(function() { playSound(soundsToMake.positiveCrowd) }, random.getFromRange(10000, 20000));
				}
			} else { // if you are the away team/black
				crowdControl.playApplause(soundsToMake.negativeCrowd, shotPowerLevel); //FUTURE: Pass level 0-1 based on strength of shot
				turnCrowdUpBy = crowdControl.getPercentOfMaxVolume(0.05); // half as much as when the home team scores
			}

			if (actions.game.tied) {
				turnCrowdUpBy += crowdControl.getPercentOfMaxVolume(0.075); // tie game, bump it up
			} else if (actions.team.nextPointWins) {
				turnCrowdUpBy += crowdControl.getPercentOfMaxVolume(0.05); // home team needs one more point to win
			} else if (actions.otherTeam.nextPointWins) {
				turnCrowdUpBy += crowdControl.getPercentOfMaxVolume(0.05); // away team needs one more point to win
			}

			crowdControl.adjustVolume(turnCrowdUpBy);
			//gameCompleteMessageDelay = shotPowerLevel;

			// only play awesome goal music for the home team
			if (actions.player.onfire) {
				say.addOptions(6, thingsToSay.playerStreak.onfire);
				if (actions.team.home) playAwesomeMusic = true;
			} else if (actions.team.onfire) {
				say.addOptions(6, thingsToSay.teamStreak.onfire);
				if (actions.team.home) playAwesomeMusic = true;
			} else if (actions.team.streak >= 3) {
				if (actions.team.home) playAwesomeMusic = true;
			} else if (actions.team.shutout.approaching) {
				if (actions.team.home) playAwesomeMusic = true;
			}
			if (actions.team.away) {
				if (actions.team.tie.broken) {
					// if the away team JUST passed the home team
					playMusicAfterTalking = soundsToMake.music.awayGoal; // it doesn't matter!
				}
			}

			if (actions.team.comeback.cacthup) {
				if (random.chance(.5)) playMusicAfterTalking = soundsToMake.music.startingAComeback; // only do it 50% of the time
			}

			if (playAwesomeMusic) playMusicAfterTalking = soundsToMake.music.afterAwesomeGoalScored;

			// if this is the first point of the game, team or player
			if (actions.game.firstPoint) {
				say.addOptions(1, thingsToSay.firstPoint.ofTheGame);
			} else if (actions.team.firstPoint) {
				say.addOptions(1, thingsToSay.firstPoint.ofTheTeam);
			} else if (actions.player.firstPoint) {
				say.addOptions(1, thingsToSay.firstPoint.ofThePlayer);
			}

			// STREAKS!!!
			// If a player is streaking, note that FIRST
			if (actions.player.streak >= 2) {
				say.addOptions(1, thingsToSay.playerStreak.multiplePoints);
				if (actions.player.streak >= 5) {
					say.addOptions(5, thingsToSay.playerStreak.fivePoints);
				} else if (actions.player.streak >= 4) {
					say.addOptions(20, thingsToSay.playerStreak.fourPoints);
				} else if (actions.player.streak >= 3) {
					say.addOptions(10, thingsToSay.playerStreak.threePoints);
				} else {
					say.addOptions(6, thingsToSay.playerStreak.twoPoints);
				}
			} else 
			// If a teams is streaking, note that SECONDARILY
			if (actions.team.streak >= 2) {
				say.addOptions(1, thingsToSay.teamStreak.multiplePoints);
				if (actions.team.streak >= 5) {
					say.addOptions(10, thingsToSay.teamStreak.fivePoints);
				} else if (actions.team.streak >= 4) {
					say.addOptions(4, thingsToSay.teamStreak.fourPoints);
				} else if (actions.team.streak >= 3) {
					say.addOptions(4, thingsToSay.teamStreak.threePoints);
				} else {
					say.addOptions(2, thingsToSay.teamStreak.twoPoints);
				}
			}

			// shut out warning/alerts
			if (actions.team.shutout.alert) {
				say.addOptions(10, thingsToSay.team.shutOutAlert);
				playMusicAfterTalking = soundsToMake.music.shutOutAlert;
				delayBetweenSongs = 20; // shut out alerts are important
			} else if (actions.team.shutout.approaching) {
				say.addOptions(3, thingsToSay.team.approachingShutOutAlert);
			}

			// let's also announce the score
			if (actions.game.middleOfGame) {
				if (actions.game.tied) {
					if (actions.game.nextPointWins) {
						sayAlso.addOptions(1, thingsToSay.reportScore.tiedScoreNextPointWins);
						playChargeSound(false, true);
					} else {
						sayAlso.addOptions(1, thingsToSay.reportScore.tiedScore);
					}
				} else {
					sayAlso.addOptions(1, thingsToSay.reportScore.generic);
					if (actions.team.winning) {
						sayAlso.addOptions(3, thingsToSay.reportScore.teamWinning);
					} else {
						sayAlso.addOptions(2, thingsToSay.reportScore.teamLosing);
					}
				}
			}

			// if there is music to play AND doThisAfterwards IS NOT ALREADY SET (end of game)
			
			var secsSinceLastSongPlayed = getSecondSince(config.timeLastSongWasPlayed);
			console.log("MUSIC: secsSinceLastSongPlayed = ", secsSinceLastSongPlayed);
			if (secsSinceLastSongPlayed > delayBetweenSongs) {
				if (playMusicAfterTalking && !doThisAfterwards) {
					doThisAfterwards = function() {
						playSound(random.getItem(playMusicAfterTalking));
					}
				}
			} else {
				console.log("MUSIC was played too recently, bail!!!", secsSinceLastSongPlayed);
			}

		 // END: if (actions.game.stillGoing)
		} else if (actions.game.over) {

			playSound(soundsToMake.fx.win);
			crowdControl.playApplause(soundsToMake.positiveCrowd, shotPowerLevel); //FUTURE: Pass level 0-1 based on strength of shot
			crowdControl.adjustVolume(crowdControl.maxVolume);

			// fade out any music that is playing right now ...
			// make sure you can here who the winners were, then play the winning music
			stadiumSounds.fadeOut("music");

			doThisAfterwards = function() {
				debug("end of game!");
				endGame();
			}

			// clear original arrays
			say.clearOptions();
			sayAlso.clearOptions();
			if (actions.game.finalScore.shutout) {
				say.addOptions(1, thingsToSay.finalScore.shutout);
			} else if (actions.game.finalScore.blowout) {
				say.addOptions(1, thingsToSay.finalScore.blowout);
			} else if (actions.game.finalScore.close) {
				say.addOptions(1, thingsToSay.finalScore.close);
			} else {
				say.addOptions(1, thingsToSay.finalScore.generic);
			}

		}

		// if there is nothing else, use the defaults
		if (!say.hasOptions()) {
			say.addOptions(1, thingsToSay.player.score);
			say.addOptions(1, thingsToSay.team.score);
		}

		//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
		var returnMessage
		var oReplacementValues = { oPlayer : oPlayer, oTeam : oTeam, oOtherTeam : oOtherTeam };

		var message =  say.getRandomOption();
		message      = updateMessageReplacements(message, oReplacementValues);
		returnMessage = message;
		
		var alsoMessage;
		if (sayAlso.hasOptions()) alsoMessage = sayAlso.getRandomOption();			
		if (alsoMessage) {
			alsoMessage = updateMessageReplacements(alsoMessage, oReplacementValues);
			returnMessage = returnMessage +". "+ alsoMessage; 
		}

		// put a slight delay on the announcement
		stadiumTimers.pointScoredAnnouncement = setTimeout(function() {
			doThis(returnMessage, doThisAfterwards);
		}, (1500 + (shotPowerLevel * 3000)));

		// return to user
		return { "message":returnMessage };
	}

	var mTest = -1;
	var musicTest = function() {
		//var aMusic = soundsToMake.music.afterAwesomeGoalScored;
		var aMusic = soundsToMake.music.someoneDoSomethingNow;
		//mTest++;
		// var playThis = aMusic[mTest]; // go in order
		var playThis = random.getItem(aMusic);
		//var playThis = soundsToMake.music.afterAwesomeGoalScored[0];
		var wait = playThis.end || 30000;
		console.log(playThis);
		playSound(playThis)
		setTimeout(musicTest, wait + 500);
	}

	var voiceTest = function() {
		//sayThis("Kevin Stachura");
		//sayThis("Big Red");
		//sayThis("Sterling Heibeck");
		sayThis("And it's Mark with a 2 point streak.");
		sayThis("And it's Mark with a 2 point streak..");
		sayThis("And it's Mark, he's streaking.");
		sayThis("Nick Beukema");
		sayThis("The Sterl");
		sayThis("The Ninja");
	}

	var randomTest = function() {
		var returnVal = "randomTest";
		random.init();
		setTimeout(function() {
			var testRange = 10;

			var counts = new Array(testRange);
			var r = 0;
			for(var x = 0; x < 1000; x++) {
				r = random.getIntFromRange(1,testRange);
				//r = Math.floor(random.getFromRange(1,100) / 10);
				if (!counts[r-1]) counts[r-1] = 0;
				counts[r-1]++;
				console.log(r);			
			}
			for (var i = 0; i < counts.length; ++i) {
			    console.log(i+1, counts[i]);
			}

		}, 3000);


		return returnVal;
	}

	var stringTest = function(c) {
		
		config = MergeRecursive(config, c);
		initPlayersAndTeamViaRoster();
		resetPlayersAndTeams();

		var arrayUniqueString = [];
		var randString;
		var oT1 = getTeam("black");oT1.score = 4;
		var oT2 = getTeam("yellow");oT2.score = 3;
		var oValues = {
			"winning-score": 4,
			"losing-score": 3,
			"yellow-team": oT2,
			"yellow-o": random.getItem(getPlayer({"color": "yellow", "position": "o"}).names),
			"yellow-d": random.getItem(getPlayer({"color": "yellow", "position": "d"}).names),
			"black-team": oT1,
			"black-o": random.getItem(getPlayer({"color": "black", "position": "o"}).names),
			"black-d": random.getItem(getPlayer({"color": "black", "position": "d"}).names),
			oPlayer : getPlayer({"color": "black", "position": "o"}), 
			oTeam : oT1, 
			oOtherTeam : oT2
		};

		updateLocalEnviromentInfo(function() {

			for (var category in thingsToSay) {
				for (var subCategory in thingsToSay[category]) {
					thingsToSay[category][subCategory].forEach(function(item) {
						console.log(item);
						var thisItemCount = 0;
						var badTries = 0;
						var idxFound = -1;
						while(badTries <= 100) {
							randString = updateMessageReplacements(item, oValues) 
							idxFound = arrayUniqueString.indexOf(randString)

							if (idxFound == -1) {
								console.log(thisItemCount++, randString);
								arrayUniqueString.push(randString);
							} else {
								badTries++;
							}
						}
					});
				}
			}

			console.log("arrayUniqueString.length", arrayUniqueString.length);
			var i = 1;
			arrayUniqueString.sort();
			console.log("arrayUniqueString.sorted");
			arrayUniqueString.forEach(function(item) {
				console.log(i++, item);
			});
		}); // end weather update function
	}

	var doWordFixes = function(msg) {
		return msg.replace(/BizStream/g, "Biz Stream")
			.replace(/The Sterl/g, "The Sturl")
			.replace(/Beukema/g, "Beukuma")
			.replace(/defense/g, "D-fence")
			//.replace(/offense/g, "D-fence")
		;
	}

	var doThis = function(doThisThing, doThisAfterwards) {
		if (/sound\:/.test(doThisThing)) {
			playSound(doThisThing.replace("sound:", ""));
		} else {
			// assume it is text that needs to be spoken
			sayThis(doThisThing, doThisAfterwards, true);
		}
	}

	var sayThis = function(message, doThisAfterwards, bCancelPrevious) {
		// http://blog.teamtreehouse.com/getting-started-speech-synthesis-api
		//alert(config.useTTS)
		if (config.useTTS) {
			debug("sayThis: "+ message);
			message = doWordFixes(message);
			debug("sayThis: "+ message);
			var msg = new SpeechSynthesisUtterance(message);
			msg.volume = 1;
			msg.lang = 'en-GB'; //translates on the fly - soooo awesome (japanese is the funniest)

			var originalVolume = crowdControl.getVolume();
			msg.onend = function(e) {
				// if there is something queued to say, do not restore it, and make a "blip" sound...
				if (!window.speechSynthesis.pending) {
					debug("restore the volume...");
					crowdControl.setVolume(originalVolume);

					if (stadiumSounds.music.isPlaying && stadiumSounds.music.audioElement) {
						var $music = $(stadiumSounds.music.audioElement);
						if ($music.attr("data-allow-volume-change") == 1) {
							$music.animate({volume: 1}, random.getFromRange(100, 500));
						}
					}
					// restore cheers
					$("audio.cheer").each(function() {
						$(this).animate({volume: $(this).attr("data-max-vol")}, 500);
					});
				}
				if (doThisAfterwards) doThisAfterwards();
			};

			// if the intro music is still playing, KILL IT
			if (stadiumSounds.intro.isPlaying && stadiumSounds.intro.audioElement) {
				$(stadiumSounds.intro.audioElement).animate({volume: 0},  random.getFromRange(100, 500), function() {
					stadiumSounds.stop("intro");
				});
			}


			// if there is music playing, lower it so we can hear the announcer
			if (stadiumSounds.music.isPlaying && stadiumSounds.music.audioElement) {
				$(stadiumSounds.music.audioElement).animate({volume: .15}, 500);
			}
			// lower the cheers
			$("audio.cheer").animate({volume: .35}, 500);


			//msg.volume = 1; // 0 to 1
			//msg.rate = 1; // 0.1 to 10
			//msg.pitch = 2; //0 to 2
			//msg.voice = 'Hysterical'; // this seems to do nothing
			debug("lower volume for speaking...");
			if (crowdControl.getVolume() > .05)
				crowdControl.setVolume(.05);
			else if (crowdControl.getVolume() > 0)
				crowdControl.setVolume(crowdControl.minVolume);

			config.timeLastAnnouncementWasMade = new Date();
			if (bCancelPrevious) {
				window.speechSynthesis.pause();
				window.speechSynthesis.cancel();
			}
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
			Debug(item);
		}
	}

	var textExport = function() {

	}


	return {
		//getPlayer: getPlayer,
		//getTeam: getTeam,
		//updateMessageReplacements: updateMessageReplacements,
		//updateStreaks: updateStreaks,
		//random.getItem: random.getItem,
		//sayThis: sayThis,
		scorePoint: scorePoint,
		voiceTest: voiceTest,
		musicTest: musicTest,
		randomTest: randomTest,
		stringTest: stringTest,
		textExport: textExport,
		stop: stopGame,
		init: init
	};
}]);