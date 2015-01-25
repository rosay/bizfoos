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


app.factory('announcerService', [ function announcerService () {
	"use strict";

	var GAME_UPDATE_CHECK_EVERY_X_MILIS = 7000;

	var soundRootPath = "sounds/"
	if (window.location.protocol == "file:") soundRootPath = "../../../sounds/";
		
	var config = {
		"pointsNeededToWin": 5,
		"series:": 1,
		"useTTS": true,
		"skipIntro": false,
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
		minVolume : .03,
		maxVolume : .75,

		audioElement : null,
		audioApplause : null,
		startCrowd: function() {
			var crowd = getSoundFile("crowd");
			if ($("#bgCrowdAudio").length == 0) {
				$("body").append('<audio id="bgCrowdAudio" loop="loop" src="'+ crowd +'"></audio>')
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
		getVolume: function() { return crowdControl.audioElement.volume; },
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
			var adjustTo = ((Math.random() - .4) * .1) / 2; // add a random value between -.02 to +.03 (technically, should always be moving up...)
		 	crowdControl.adjustVolume(adjustTo);
		},
		fadeOut: function(delay, callback) {
			$("#bgCrowdAudio").animate({ volume: 0 }, delay, callback)
		}
	}
	
	var teamNames = {

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
		fx : {
			win : [
				"win-1.mp3", 
			],
			score : [
	//				"score-1.mp3", 
					"score-2.mp3", 
	//				"score-3.mp3", 
	//				"score-4.mp3", 				
	//				"score-5.mp3", 
	//				"score-6.wav"
			]
		},

		// http://www.letsgowings.com/forums/topic/76330-songs-played-at-joe-louis-arena/

		music : {
			intro : [
				{ type: "intro", vol: 0.15, file: "intro.wav" }
				//, "monday-night-football-94635-4694b335-2e6b-4d16-a4a4-0c672e2eb298.mp3" // 17 seconds
			],
			letsGetReadyToRumble : [
				{ type: "intro", vol: 1, fade: true, file: "music/lets-get-ready-to-rumble-88035-f4d7d1a6-dd49-435a-955e-de52157812be.mp3" }
			],
			// http://www.soundboard.com/sb/CulpeperHSFootball
			// http://www.soundboard.com/sb/ricky38501
			// http://www.soundboard.com/sb/jimi_yorke1
			// http://www.soundboard.com/sb/WiiHockey
			// http://www.soundboard.com/sb/SportsChantsCharge
			// http://www.soundboard.com/sb/thatbassboard
			// http://www.soundboard.com/sb/LCSC
			afterAwesomeGoalScored : [

				//TO DO ADD:
				// BLur Song 2
				// Everything I do It's Magic, Magic Weezer


				{ type: "music", fade: true,  start: 0, end: 13000, file: "music/Best Goal Song Ever215099-4cb8905f-a537-4486-8808-a3c6bebe64ae.mp3" },
				{ type: "music", fade: true,  start: 0, end: 17000, file: "music/Survivor - Eye of the Tiger215099-056b6ddb-3fe7-4e8c-981e-d9891fdf3d96.mp3" },
				{ type: "music", fade: true,  start: 0, end: 15000, file: "music/Oh Yeah (music track)215099-a10d5348-5d2a-4393-b54f-f9da2907d820.mp3" },
				{ type: "music", fade: true,  start: 0, end: 12000, file: "music/Crazy Train215099-fc7de501-18e1-42e7-8a88-640fab289954.mp3" },
				{ type: "music", fade: true,  start: 0, end: 13000, file: "music/Pump the Crowd - Rock 'n' Roll215099-44b24e25-71af-458a-beff-bab3959b7128.mp3"},
				{ type: "music", fade: true,  start: 0, end: 16000, file: "music/U Cant Touch This -MC Hammer215099-a9933f26-50cb-4ce3-adb4-c1d515b5f7f5.mp3" },
				{ type: "music", fade: true,  start: 0, end: 14000, file: "music/We Like To Party215099-1f217a9a-02fb-4238-b4a1-ba4ee81c3c33.mp3" },
				{ type: "music", fade: true,  start: 0, end: 14000, file: "music/I Got You I Feel Good - James Brown 215099-0cfa60a5-7be1-4a96-9c45-55a46b631b0e.mp3" },
				{ type: "music", fade: true,  start: 0, end: 30000, file: "music/Thunderstruck - ACDC215099-60f70578-2abb-4058-b400-c5d4c5191dbc.mp3" },
				{ type: "music", fade: true,  start: 0, end: 17000, file: "music/Jump Around215099-cd384755-b62e-4b1d-a8ab-89883d05b17d.mp3" },
				{ type: "music", fade: true,  start: 0, end: 15000, file: "music/94635-e820d841-f42d-46b9-b44f-ae625f2ffe96.mp3" },
				{ type: "music", fade: true,  start: 0, end: 20000, file: "music/mission-impossible-94635-b2ea9d6e-2499-4f60-917d-51acb04f5435.mp3" },
				{ type: "music", fade: true,  start: 0, end: 35000, file: "music/queen-we-will-rock-you-94635-35e3e035-af81-41df-ac46-238d653c1b99.mp3" },
				{ type: "music", fade: true,  start: 0, end:  6000, file: "music/jaws-94635-6312a539-9fd3-4105-9e9c-33f174cee965.mp3" },
				{ type: "music", fade: true,  start: 0, end:  8000, file: "music/knight-rider-94635-4cb99e76-8e98-4cc2-9cf3-703627666c35.mp3" },
				{ type: "music", fade: true,  volstart: 1, start: 0, end: 33000, file: "music/whoomp-there-it-is-OTY3NzQ5NTQ5Njc4Mzk_VoEy4AVVJjA.mp3" },
				{ type: "music", fade: true,  volstart: 1, start: 33000, end: 10000, file: "music/whoomp-there-it-is-OTY3NzQ5NTQ5Njc4Mzk_VoEy4AVVJjA.mp3" },
				{ type: "music", fade: true,  start: 0, end: 12000, file: "music/wild-side-65515-a0b7e206-156f-40c5-83cd-1ee87ae17371.mp3" },
				{ type: "music", fade: true,  start: 0, end: 28000, file: "music/welcome-to-the-jungle-65515-97fe62cd-746b-4265-9bac-805acd86e252.mp3" },
				{ type: "music", fade: true,  start: 0, end: 19000, file: "music/all-i-do-is-one-201470-165d44eb-ead6-4e1a-ab44-e822a15237c6.mp3" },
				{ type: "music", fade: true,  start: 0, end: 30000, file: "music/Song - Happy217844-7f887dc7-c5cf-48ea-ac47-0a6795f7c7ea.mp3" },
				{ type: "music", fade: true,  start: 0, end: 13000, file: "music/Song - Ive Got the Power217844-d57ada2a-3597-480e-b991-b9faf3ffce7a.mp3" },
				{ type: "music", fade: true,  start: 0, end: 22000, file: "music/SIP - Til I Collapse217844-5f7e1e8c-7191-44bc-a28c-9d95bb6627c5.mp3" },
				{ type: "music", fade: true,  start: 0, end: 20000, file: "music/SIP - Locked Out Of Heaven217844-c5f78886-a4fc-4093-a231-e5c8a529f8c9.mp3" },
				{ type: "music", fade: true,  start: 0, end: 20000, file: "music/SIP - Without Me Remix217844-7c548ec2-8a3c-4635-8c82-b098a285bb98.mp3" },
				{ type: "music", fade: true,  start: 0, end: 15000, file: "music/SIP - Seven Nation Army217844-441aff80-8125-4861-b98f-666c938f9e95.mp3" },
				{ type: "music", fade: true,  volstart: 1, start: 0, end: 10000, file: "music/SIP - Fuel217844-73324ff7-f955-40b4-92d1-63bf20d1c9e4.mp3" },
				{ type: "music", fade: true,  start: 0, end: 25000, file: "music/SIP - Enter Sandman217844-74d43275-a90f-41f4-8b4e-984aa273ae77.mp3" },
				{ type: "music", fade: true,  start: 0, end: 16000, file: "music/SIP - Call Me Maybe217844-b6c75657-5b9e-4009-b18b-7a1d066d56a1.mp3" },
				{ type: "music", fade: true,  start: 0, end: 16000, file: "music/SIP - Break Your Heart217844-fcad0017-8fb7-462a-b563-836c8b4dfb57.mp3" },
				{ type: "music", fade: true,  volstart: 1, start: 0, end: 15000, file: "music/I'm-to-sexy-NjMxMTQxNzE2MzExNjQ_0VP46tDcKEc.mp3" },
				{ type: "music", fade: true,  start: 0, end: 14000, file: "music/Who Let the Dog's Out215099-3db7ba1f-03df-46d4-8c6d-9def824ae3f0.mp3"},
				//{ type: "music", fade: true,  start: 0, end: 15000, file: "music/" },
				//{ type: "music", fade: true,  start: 0, end: 15000, file: "music/" },
				//{ type: "music", fade: true,  start: 0, end: 15000, file: "music/" },
				//{ type: "music", fade: true,  start: 0, end: 15000, file: "music/" },
				//{ type: "music", fade: true,  start: 0, end: 15000, file: "music/" },
				//{ type: "music", fade: true,  start: 0, end: 15000, file: "music/" },
				//{ type: "music", fade: true,  start: 0, end: 30000, file: "music/Thunderstruck - ACDC215099-60f70578-2abb-4058-b400-c5d4c5191dbc.mp3" },
			],
			awayGoal : [
				/*
				Away Team Goals
				No More Mr. Nice Guy - Alice Cooper
				Uprising - Muse
				One is the Loneliest Number - Three Dog Night
				*/

				{ type: "music", fade: true,  start: 0, end: 8500, file: "music/Away Goal - It Doesnt Matter217844-d4fc0f49-3808-43cf-a972-8df7ab0f1fb4.mp3" },
				{ type: "music", fade: true,  start: 0, end: 21000, file: "music/SIP - Wheres your head at217844-7401f6ee-6bfa-4e05-a98c-06fcb53ca51d.mp3" },
				{ type: "music", fade: true,  start: 0, end: 21000, file: "music/SIP - Fight for Your Right217844-04310f82-b577-482b-a6a8-6e73b4a79179.mp3" },
				//{ type: "music", fade: true,  start: 0, end: 15000, file: "music/" },
				//{ type: "music", fade: true,  start: 0, end: 15000, file: "music/" },
			],
			startingAComeback : [
				{ type: "music", fade: true,  start: 0, end: 5000, file: "music/SIP - Started From The Bottom 217844-2518f532-9abb-4165-befc-71c16eb11005.mp3" },
				{ type: "music", fade: true,  start: 0, end: 11000, file: "music/SIP - No Sleep Till Brooklyn217844-1d430377-f6a6-41dd-a442-bd56f1e6d28a.mp3" },
				{ type: "music", fade: true,  start: 0, end: 19000, file: "music/SIP - Walk217844-0b7fb1e2-e4c8-4ec0-9c98-7694a7cfafc9.mp3" },
				//{ type: "music", fade: true,  start: 0, end: 15000, file: "music/" },
				//{ type: "music", fade: true,  start: 0, end: 15000, file: "music/" },
				//{ type: "music", fade: true,  start: 0, end: 15000, file: "music/" },
			],
			someoneDoSomethingNow : [
				{ type: "music", vol: 0.4, fade: true,  start: 0, end: 16500, file: "music/Pump The Crowd - Get Ready For This215099-120fa195-6fa0-463f-b003-9fb4d99dc5f3.mp3"},
				{ type: "music", vol: 1.0, fade: true,  start: 0, end: 19000, file: "music/everybody-dance-now-NzQ3NDQ5NTQ3NDc1MjM_c28jQ4MF8M0.mp3" },
				{ type: "music", vol: 0.4, fade: true,  start: 0, end: 19500, file: "music/SIP - Blitzkrieg Bop217844-4c64f818-88bc-4cc1-b6b7-dc77ba241e81.mp3" },
			],
			shutOutAlert : [
				{ type: "fx", fade: true,  colstart: 1, start: 0, end: 10000, file: "music/air-raid-94635-0a641a78-6ba9-4821-83ce-9226b4807edc.mp3" },
				{ type: "music", fade: true,  start: 0, end: 17000, file: "music/goal-siren-prodigy-65515-bb8ef7ea-86e5-40aa-a03f-e83b3e8c5c53.mp3" },
			],
			finalPoint : [
				{ type: "music", fade: true,  start: 0, file: "music/queen-we-are-the-champions-94635-2fa5f86e-5441-4722-970d-319a174f76f3.mp3" },
				{ type: "music", fade: true,  start: 0, end: 19000, file: "music/all-i-do-is-one-201470-165d44eb-ead6-4e1a-ab44-e822a15237c6.mp3" },
				{ type: "music", fade: true,  start: 0, end: 16000, file: "music/U Cant Touch This -MC Hammer215099-a9933f26-50cb-4ce3-adb4-c1d515b5f7f5.mp3" },
				{ type: "music", fade: true,  start: 0, end: 13000, file: "music/Best Goal Song Ever215099-4cb8905f-a537-4486-8808-a3c6bebe64ae.mp3" },
				"announcer/be-post-game-show-NTg3MTU4OTM5NTg3MjAx_9RYro5iSkmA.MP3"
			]
		},
		organ : {
			charge : [
				{ type: "organ", file: "cheering-charge-1.wav" }, 
				{ type: "organ", file: "organ-hockey-organ-charge_GkVzP3EO.mp3" }, 
				{ type: "organ", file: "organ-hockey-organ-melody-in-stadium-arena_M17SP3EO.mp3" }, 
				{ type: "organ", file: "organ-hockey-organ-melody-lets-go_fJT8P3N_.mp3" }, 
			],
			chargeLong : [
				{ type: "organ", file: "organ-sports-arena-music-organ-charge-ascend-reverb.mp3" }, // 18s
				{ type: "organ", file: "organ-sports-arena-music-organ-melody-ascend-reverb_M1ptqYEu.mp3" }, // 16s
				{ type: "organ", file: "organ-sports-arena-music-mexican-hat-dance-organ-clap_fyxsqtNu.mp3" }, // 11s
			],
			cheer : [
				{ type: "organ", file: "organ-short-single-chord-sports-arena-music-organ-chord-stab-reverb_Gkn29tNu.mp3" }, 
			]
		},
		background : {
			crowd : [
				"crowd.wav" 
			],
		},
		positiveCrowd : {
			airhorn : [
				{ type: "cheer", file: "air-horn_Mka55z4u.mp3" }, 
				{ type: "cheer", file: "airhorn.wav" }
			],
			cheer : [
				{ type: "cheer", volMax: .75, file: "applause-1.mp3" }, 
				{ type: "cheer", volMax: .75, file: "applause-1.wav" },
				{ type: "cheer", volMax: .75, file: "applause-2.wav" },
				{ type: "cheer", volMax: .75, file: "applause-3.wav" },
				{ type: "cheer", volMax: .75, file: "applause-4.wav" },
				{ type: "cheer", volMax: .75, file: "applause-5.wav" },
				{ type: "cheer", volMax: .75, file: "cheer-crowd-battle-cry-ahhhoh_M1S_ZOV_.mp3" },
				{ type: "cheer", volMax: .75, file: "cheer-crowd-cheer-clap-scream_fJkt-OV_.mp3" },
				{ type: "cheer", volMax: .75, file: "cheer-crowd-hooray_MJzKZ_4_.mp3" },
				{ type: "cheer", volMax: .75, file: "cheer-crowd-loud-ohh_zyqq-uEd.mp3" }, 
				{ type: "cheer", volMax: .75, file: "cheer-crowd-scream-goal_Myqs-u4_.mp3" }, 
				{ type: "cheer", volMax: .75, file: "cheer-crowd-scream-hooray_z1g3W_4d.mp3" }, 
				{ type: "cheer", volMax: .75, file: "cheer-crowd-scream-oh-yeah_MyNnbuEd.mp3" },
				{ type: "cheer", volMax: .75, file: "cheer-crowd-scream-ohh_zJL3bO4u.mp3" },
				{ type: "cheer", volMax: .75, file: "cheer-crowd-scream-shocked-whoa_fkd3-dN_.mp3" },
				{ type: "cheer", volMax: .75, file: "cheer-crowd-scream-yes_MykaZO4O.mp3" },
				{ type: "cheer", volMax: .75, file: "cheer-crowd-tongue-rolls_Gy9aZuVd.mp3" }, 
				{ type: "cheer", volMax: .75, file: "cheer-crowd-vocal-element-goal-long_G1j6-ON_.mp3" },
				{ type: "cheer", volMax: .75, file: "cheer-crowd-yes-unison_MkhTW_V_.mp3" },
				{ type: "cheer", volMax: .75, file: "cheer-sports-event_MJoQI64u.mp3" },
				{ type: "cheer", volMax: .75, file: "crowd-cheer-baseball-game.mp3" },
				{ type: "cheer", volMax: .75, file: "crowd-cheer-baseball-game_M1WXv2Nd.mp3" },
				{ type: "cheer", volMax: .75, file: "crowd-cheer-baseball-game_z1IbPhE_.mp3" },
				{ type: "cheer", volMax: .75, file: "crowd-scream-go-go-go_zJ6Kb_Nu.mp3" },
				{ type: "cheer", volMax: .75, file: "crowd-scream-whoa_MJAnZO4O.mp3" },
				{ type: "cheer", volMax: .75, file: "crowd-clap-unison-pattern-loop_zJG5ZOV_.mp3" },
				{ type: "cheer", volMax: .75, file: "crowd-cheers-and-whistles_MyWbxfVu.mp3" },
				{ type: "cheer", volMax: .75, file: "crowd-applaud-cheer-scream_GyrL-d4O.mp3" },
				{ type: "cheer", volMax: .75, file: "crowd-cheer-clap-scream_fJkt-OV_.mp3" },
				{ type: "cheer", volMax: .75, file: "crowd-scream-oh-yeah_MyNnbuEd.mp3" },
				{ type: "cheer", volMax: .75, file: "huge-crowd-response_Mys7gfEu.mp3" },
				{ type: "cheer", volMax: .75, file: "large-audience-medium-applause_MyTixHNO.mp3" },
				{ type: "cheer", volMax: .75, file: "screaming-teenage-girls-short_zJmNSSEu.mp3" },
				{ type: "cheer", volMax: .75, file: "stadium-applause_GJxblfEd.mp3" },
				{ type: "cheer", volMax: .75, file: "stadium-crowd-cheer-1_fJJQlMVu.mp3" },
				{ type: "cheer", volMax: .75, file: "stadium-crowd-cheer-2_zJ7SezVu.mp3" },
				{ type: "cheer", volMax: .75, file: "stadium-reaction-3_fkr4lG4u.mp3" },
			],
			chant : [
				{ type: "cheer", file: "chant-chanting-concert-applause_zyGZ-HE_.mp3" }, 
				{ type: "cheer", file: "chant-male-crowd-chanting-solidarnosc_MknsmSNu.mp3" }, 
			]
		},
		negativeCrowd : {
			aww : [
				{ type: "cheer", file: "aww-crowd-aww-disappointed_G1SdWOVd.mp3"}, 
				{ type: "cheer", file: "aww-crowd-aww_GJKdZ_Nu.mp3"}, 
				{ type: "cheer", file: "aww-crowd-disgusted-aww_G1qd-OVd.mp3"}, 
				{ type: "cheer", file: "aww-crowd-disgusted-aww_zkuqZdN_.mp3"}, 
				{ type: "cheer", file: "aww-crowd-scream-aww_fJa9Z_V_.mp3"},
				{ type: "cheer", file: "crowd-aww-disappointed_G1SdWOVd.mp3" },
			],
			boo : [
				{ type: "cheer", file: "boo-1.wav" }, 
				{ type: "cheer", file: "boo-2.wav" }, 
				{ type: "cheer", file: "boo-3.wav" }, 
				{ type: "cheer", file: "boo-4.wav" }, 
				{ type: "cheer", file: "boo-5.wav" }, 
				{ type: "cheer", file: "boo-crowd-boo_fkA_ZONd.mp3" }, 
				{ type: "cheer", file: "crowd-boos-2_MJcMezVu.mp3" },
				{ type: "cheer", file: "crowd-boo_fkA_ZONd.mp3" },
				{ type: "cheer", file: "crowd-boos-1_G1amezEd.mp3" },
			],
			ohno : [
				{ type: "cheer", file: "oh-no-crowd-scream-oh-no_fkm3Zu4_.mp3" }, 
				{ type: "cheer", file: "crowd-painful-ohh_fkmKbONO.mp3" },
				{ type: "cheer", file: "boo-crowd-scream-no-different-times_My-nZdNu.mp3" }, 
				{ type: "cheer", file: "boo-crowd-scream-no_M1xhZ_Nd.mp3" }
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
				"For today's match-up we have {{{yellow-team}}/{{yellow-o}} and {{yellow-d}}} on the {yellow/home} team. And on the {black/away} team we have {{black-o}} and {{black-d}}. {{black-o}} will be playing offense for the black team and {{yellow-d}} will be {playing defense/defending the goals} for {{yellow-team}}"
				,"{This match up of/Our match up for today of} {{yellow-team}} and {{black-team}} {will/should} be {great/incredible/entertaining/interesting/fun}. On {{black-team}}, We have {{black-d}} on defense. and {{black-o}} on Oh. For the home team, {{yellow-team}}, It will be {{yellow-o}} {doing the scoring/on offense/on Oh}. {while/and} {{yellow-d}} {will be/is} {D-fending/on defense}."
			]
		},

		//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
		// Options for annoncing when someone scores
		firstPoint : {
			ofTheGame : [
				"First point of the game by {{name}}"
				,"{{name}} {with the/starts us off with the/knocks in the/puts in the} first {score/score of the game/shot on the table}"
				,"{{name}} with the first {score/ball in the hole}"
				,"{{team}} break{{team{s|}}} the ice with a 1 to 0 lead. {Great/excellent/nice} {shot/goal/point/score} {by/from} {{name}}."
				,"{{name}} breaks the ice with a 1 to 0 lead"
				,"And now {{team}} {{team{is|are}}} in the lead thanks to {{name}} with the first point"
				//,"wav:and_another_one.wav"
			],
			ofTheTeam : [
				"And now {{team}} {{team{is|are}}} on the board with 1 point by {{name}}"
				,"{{name}} with the first goal for {{team}}"
				,"{{name}} puts {{team}} on the {score/}board"
				//,"wav:and_another_one.wav"
			],
			ofThePlayer : [
				"And no} {{name}} is scoring points for {{team}}"
				,"{{name}} {has put in/with/puts in/scores/drops/sinks} his first goal for {{team}}"
				,"{{name}} puts {{team}} on the {score/}board"
				//,"wav:and_another_one.wav"
			]
		},
		playerStreak : {
			onfire : [
				"{{name}} is on fire!"
				,"{{name}} is {tearing it up/crushing {{other-team}}} with {a few/some} {quick/rapid-fire} {goals/points}!"
				,"And it's {{name}} with another one! He's on fire!"
			],
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
				 ,"This is a {tight/close/tough} {game/match-up} with the {scores at/score board showing} {{winning-score}} to {{losing-score}}"
				 ,"{All tied up at/we're even with a score of/It's anyones game with a score of} {{winning-score}} and {{losing-score}}"				
			]
		},
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
		"That's three in a row by {{team}}"
		,"{{team}} with another goal. 3 point streak."
		,"And they sink another one. Three in a row by {{team}}"
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
		,"It's on. It's on like donkey kong. The Next {point/score/goal} ends {the game/this battle}."
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

	var itemsAlreadyUsed = [];
	var maxUniqueRetryAttempts = 0;
	var getRandomItem = function(aData) {
		var returnThis = aData[Math.floor(Math.random()*aData.length)];
		var indexAlreadyUsed = itemsAlreadyUsed.indexOf(returnThis);
		debug("already used it?  "+ indexAlreadyUsed +" ... retries: "+ maxUniqueRetryAttempts)
		if (indexAlreadyUsed >= 0 && maxUniqueRetryAttempts < 5) {
			debug("already used it, try again...")
			debug(returnThis);
			// call it again
			maxUniqueRetryAttempts++;
			return getRandomItem(aData);
		} else {
			maxUniqueRetryAttempts = 0;
			itemsAlreadyUsed.push(returnThis);
			return returnThis;
		}
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
				"playerid": config.roster.teamOrange.offense._id,
				"color": "yellow",
				"position": "o",
				"team": "The Yellow Team",
				"names": createNameList(config.roster.teamOrange.offense)
			},
			{	//3
				"playerid": config.roster.teamOrange.defense._id,
				"color": "yellow",
				"position": "d",
				"team": "The Yellow Team",
				"names": createNameList(config.roster.teamOrange.defense)
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

	// TODO Add to database
	var specialTeamNames = [
		{ name: "The Avengers", players : ["sheibeck@bizstream.com", "mschmidt@bizstream.com"]},
		{ name: "The Dream Team", players : ["areece@bizstream.com", "ahovingh@bizstream.com"]},
		{ name: "Team Brark", players : ["mschmidt@bizstream.com", "bmckeiver@bizstream.com"]},
		{ name: "Team Co Co", players : ["crose@bizstream.com", "cvandenbout@bizstream.com"]},
	]

	var setTeamName = function(color, players) {
		var pOffense = getPlayer({color: color, position: "o"});
		var pDefense = getPlayer({color: color, position: "d"});

		var returnTeamName = "The "+ color +" Team";
		specialTeamNames.forEach(function(st) {
			if (st.players.indexOf(pOffense.playerid) >= 0 && st.players.indexOf(pDefense.playerid) >= 0) {
				returnTeamName = st.name;
				return;
			}
		});

		return returnTeamName;
	}

	var endGame = function() {
		
		playSound(soundsToMake.music.finalPoint);
		stadiumTimers.endGame1 = setTimeout(function() { playSound([soundsToMake.positiveCrowd.cheer, soundsToMake.positiveCrowd.chant]); }, 1000);
		stadiumTimers.endGame2 = setTimeout(function() { playSound([soundsToMake.positiveCrowd.cheer, soundsToMake.positiveCrowd.chant]); }, 8000);
		stadiumTimers.endGame3 = setTimeout(function() {
			playSound([soundsToMake.positiveCrowd.cheer, soundsToMake.positiveCrowd.chant]);
			crowdControl.fadeOut(30000, stopGame);
		}, 5000)
	}

	var stopGame = function() {
		crowdControl.stopCrowd();
		stadiumSounds.stopAll();

		// clear all timers
		stadiumTimers.stopAll();

		// stop talking
		window.speechSynthesis.cancel();
		//window.speechSynthesis.pause();

		//reset "get random item array"
		itemsAlreadyUsed = [];
		maxUniqueRetryAttempts = 0;
		debug("GAME OVER!!!!!!!!!!!!!");
	}

	var resetGame = function() {
		stopGame();

		config.gameStartTime = new Date();
		config.timeLastGoalWasScored = config.gameStartTime;
		config.timeLastAnnouncementWasMade = config.gameStartTime;

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
		if (Math.random() < .333) {
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
			}, 15000 + (Math.random() * 15000));
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
			var message = getRandomItem(thingsToSay.newGame.intro);
			message     = updateMessageReplacements(message, {})
			sayThis(message);

			//todo, also announce player positions and team names and colors/sides
			message = getRandomItem(thingsToSay.newGame.teamsAndPlayersIntro);
			debug(getPlayer({"color": "yellow", "position": "o"}))
			message = updateMessageReplacements(message, {
				// yellow-team, black-team, yellow-d, yellow-o, black-d, black-o
				"yellow-team": getTeam("yellow").team,
				"yellow-o": getRandomItem(getPlayer({"color": "yellow", "position": "o"}).names),
				"yellow-d": getRandomItem(getPlayer({"color": "yellow", "position": "d"}).names),
				"black-team": getTeam("black").team,
				"black-o": getRandomItem(getPlayer({"color": "black", "position": "o"}).names),
				"black-d": getRandomItem(getPlayer({"color": "black", "position": "d"}).names),
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
					if (Math.random() > .6) {
						if (Math.random() > .4) {
							// play charge sound
							playChargeSound(bLetSeeSomeActionAllowBoos, false);
						} else {
							// play pump up the table music
							playSound(soundsToMake.music.someoneDoSomethingNow);
						}
					}
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
			fileName = getRandomItem(aryChooseFrom, true);
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
		music: { allowMultiple: false, isPlaying : false, audioElement: null },
		intro: { allowMultiple: false, isPlaying : false, audioElement: null },
		organ: { allowMultiple: false, isPlaying : false, audioElement: null },
		cheer: { allowMultiple: true },
		fx:    { allowMultiple: true },
		
		fadeOut : function(whichChannel, delay) {
			var thisChannel = this[whichChannel];
			if (thisChannel.isPlaying && thisChannel.audioElement) {
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

	var playSound = function(soundType, settingsParam) {
		var playThisFile = getSoundFile(soundType);
		var settings = {
			file: "",
			fade: false,
			volstart: 0,
			vol: 1,
			start: 0,
			end: null,
		}
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

		//debug("final settings:");
		debug(settings);

		//debug(stadiumSounds.intro);
		//debug(settings.type +" = "+ stadiumSounds[settings.type]);
		if (settings.type) {
			if (!stadiumSounds[settings.type].allowMultiple) {
				if (stadiumSounds[settings.type].isPlaying) {
					//bail
					debug("NOT GOING TO PLAY THIS SONG... busy playing something else...")
					// try again in 4 seconds? This is questionable, Not sure if I want to do this, might get out of control
					stadiumTimers.queueSongForLater = setTimeout(function() { playSound(soundType) }, 4000);
					return false;
				}
				stadiumSounds[settings.type].isPlaying = true;
			}
		}


		//set defaults
		settings.vol = (settings.vol ? settings.vol : 1);

		//var sound = new Audio(playThisFile);
		var sound = document.createElement('audio');
		sound.src = settings.file;
		if (settings.start > 0) {
			sound.currentTime = settings.start;
		}
		if (settings.fade) {
			sound.volume = (settings.volstart ? settings.volstart : 0);
			sound.play();
			$(sound).animate({volume: settings.vol}, 750 + (Math.random() * 2000));
		} else {
			sound.volume = settings.vol;
			sound.play();
		}

		// save this volume as the MAX volume
		$(sound).attr("data-max-vol", sound.volume);

		// if music is playing, and we can talk, we can fade it out later
		if (settings.type) {
			debug(settings.type)
			stadiumSounds[settings.type].audioElement = sound;
		}

		if (settings.end > 0) {

			var endAfter = settings.end;
			// put a little variation into it
			if (endAfter > 10000) // if more than 10 seconds, let's make the length variable
				endAfter = (endAfter - 7000) + (Math.random() * 11000); //So, we are going to -7 or +4 seconds

			setTimeout(function() { 
				stadiumSounds.fadeOut(settings.type, 750 + (Math.random() * 2000));
			},  endAfter);
		}

		// add to body to make my life easier
		$("body").append(sound);
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
			stadiumTimers.queueChargeForLater = setTimeout(playCharge, (5000 + (Math.random() * 15000)));
		else
			playCharge();
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
		var gameCompleteMessageDelay = 0;
		var shotPowerLevel = crowdControl.ensureSafeVolume(.25 + Math.random(), crowdControl.audioElement.volume)
		debug(shotPowerLevel)

		// points for shut out warning...
		var closeMatchPoints = (config.pointsNeededToWin - 1); // eventually should be a percentage

		// play a sound effect
		if (oTeam.score == config.pointsNeededToWin) {
			playSound(soundsToMake.fx.win);
			crowdControl.playApplause(soundsToMake.positiveCrowd, shotPowerLevel); //FUTURE: Pass level 0-1 based on strength of shot

			// fade out any music that is playing right now ...
			// make sure you can here who the winners were, then play the winning music
			stadiumSounds.fadeOut("music");

			doThisAfterwards = function() {
				debug("end of game!");
				endGame();
			}

		}
		else {
			playSound(soundsToMake.fx.score);
			
			// if you are the home team/yellow
			//if (Math.random() >.3) {
			if (oTeam.color == "yellow") {
				crowdControl.playApplause(soundsToMake.positiveCrowd, shotPowerLevel); //FUTURE: Pass level 0-1 based on strength of shot

				// occasionally, play another random sound
				if (Math.random() <.2) {
					//10 to 20 secnds in the future
					stadiumTimers.queuePositiveCrowd = setTimeout(function() { playSound(soundsToMake.positiveCrowd) }, 10000 + (Math.random() * 10000));
				}
			} else { // if you are the away team/black
				crowdControl.playApplause(soundsToMake.negativeCrowd, shotPowerLevel); //FUTURE: Pass level 0-1 based on strength of shot

			}
			gameCompleteMessageDelay = shotPowerLevel;
		}


		

		// array to be used to load random options of messages
		var sayThisOptions = [];
		var sayThisAlsoOptions = [];

		// only play awesome goal music for the home team
		// if (oTeam.color == "yellow")		


		var playMusicAfterTalking;
		if (oTeam.pointStreak >= 3 && oTeam.score < config.pointsNeededToWin) {
			// if it is more than a 3 point streak
			if (oTeam.color == "yellow") playMusicAfterTalking = soundsToMake.music.afterAwesomeGoalScored;
		} else if (oPlayer.pointStreak >= 2 && getSecondSince(oTeam.timeLastGoalWasScored) < 20) {
			// 2 points in a quick about of time by the same team
			sayThisOptions = thingsToSay.playerStreak.onfire;
			// Wow, another one, rapid fire...
			if (oTeam.color == "yellow") playMusicAfterTalking = soundsToMake.music.afterAwesomeGoalScored;
		} else if (oTeam.pointStreak >= 2 && getSecondSince(oTeam.timeLastGoalWasScored) < 20) {
			// 2 points in a quick about of time by the same team
			if (oTeam.color == "yellow") playMusicAfterTalking = soundsToMake.music.afterAwesomeGoalScored;
		} else if (oTeam.score >= 2 && oOtherTeam.score == 0) {
			// 2 - 0 or more, working on a shut out
			playMusicAfterTalking = soundsToMake.music.afterAwesomeGoalScored;
		} else if (getSecondSince(oTeam.timeLastGoalWasScored) > 120) {
			// if it took a ridiculously long time to score ...
			// TODO: IF THe score took more than 120 seconds
			// FINALLY SOMEONE SCORED, even if it is the black team, it's ok, ...
			playMusicAfterTalking = soundsToMake.music.afterAwesomeGoalScored;
		} else if (oTeam.color == "yellow" && oTeam.score < oOtherTeam.score && Math.random() > .5) {
			// if the home team just score, yet still behind, ... and don't do it every time
			playMusicAfterTalking = soundsToMake.music.startingAComeback;
		} 

		if (oTeam.color == "black" && oOtherTeam.score == (oTeam.score + 1)) {
			// if the away team JUST passed the home team
			playMusicAfterTalking = soundsToMake.music.awayGoal;
		}




		config.timeLastGoalWasScored = new Date(); // update last point
		oTeam.timeLastGoalWasScored = config.timeLastGoalWasScored;
		oPlayer.timeLastGoalWasScored = config.timeLastGoalWasScored;








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
			if (oTeam.score == closeMatchPoints) {
				// empty any previous entries, this is imporant :)
				sayThisOptions = sayThis_PlayerScores_Team_ShutOutAlert;
				
				playMusicAfterTalking = soundsToMake.music.shutOutAlert;

				//playChargeSound(false, true);
			} else if (oTeam.score >= 2) {
				sayThisOptions = sayThis_PlayerScores_Team_ApporachingShutOutMoreThan2Points;
			}
		} else if (oOtherTeam.score + oTeam.score >= 3) {
			// let's also announce the score
			// score is tied up
			debug("oOtherTeam.score == oTeam.score =>", oOtherTeam.score == oTeam.score)
			// if it is tied up
			if (oOtherTeam.score == oTeam.score) {
				if (oOtherTeam.score == closeMatchPoints) {
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

		// if there is music to play AND doThisAfterwards IS NOT ALREADY SET (end of game)
		if (playMusicAfterTalking && !doThisAfterwards) {
			doThisAfterwards = function() {
				playSound(playMusicAfterTalking);
			}
		}



		// FINAL POINT
		//console.log(oTeam.score,config.pointsNeededToWin)
		if (oTeam.score == config.pointsNeededToWin) {

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
		stadiumTimers.pointScoredAnnouncement = setTimeout(function() {
			doThis(returnMessage, doThisAfterwards);
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
						$(stadiumSounds.music.audioElement).animate({volume: 1}, 100 + (Math.random() * 400));
					}
				}
				if (doThisAfterwards) doThisAfterwards();
			};

			// if the intro music is still playing, KILL IT
			if (stadiumSounds.intro.isPlaying && stadiumSounds.intro.audioElement) {
				$(stadiumSounds.intro.audioElement).animate({volume: 0}, 100 + (Math.random() * 400), function() {
					stadiumSounds.stop("intro");
				});
			}


			// if there is music playing, lower it so we can hear the announcer
			if (stadiumSounds.music.isPlaying && stadiumSounds.music.audioElement) {
				$(stadiumSounds.music.audioElement).animate({volume: .15}, 500);
			}

			//msg.volume = 1; // 0 to 1
			//msg.rate = 1; // 0.1 to 10
			//msg.pitch = 2; //0 to 2
			//msg.voice = 'Hysterical'; // this seems to do nothing
			debug("lower volume for speaking...");
			crowdControl.setVolume(crowdControl.ensureSafeVolume(originalVolume-.5, 0.05));
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
			console.log(item);
		}
	}

	var textExport = function() {

	}


	return {
		//getPlayer: getPlayer,
		//getTeam: getTeam,
		//updateMessageReplacements: updateMessageReplacements,
		//updateStreaks: updateStreaks,
		//getRandomItem: getRandomItem,
		//sayThis: sayThis,
		scorePoint: scorePoint,
		voiceTest: voiceTest,
		textExport: textExport,
		stop: stopGame,
		init: init
	};




}]);