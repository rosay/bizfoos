// todo: treat this as a service, along with random, talk to Cody
var soundData = {
	bg : {
		crowd : [
			//"win-1.mp3", 
			{ notRandom: true, type: "bg", file: "crowd.wav"},
		],
	},
	fx : {
		// http://www.pond5.com/sound-effects/1/win.html#2
		win : [
			//"win-1.mp3", 
			{ notRandom: true, type: "score", file: "045590323_prev.mp3"},
		],
		score : [
//				"score-1.mp3", 
				{ notRandom: true, type: "score", file: "score-2.mp3"}, 
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
			{ type: "music", vol: 0.4, fade: true,  start: 0, end: 21000, file: "music/SIP - Fight for Your Right217844-04310f82-b577-482b-a6a8-6e73b4a79179.mp3" },
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
			{ type: "music", vol: 0.4, fade: true,  start: 0, end: 19000, file: "music/everybody-dance-now-NzQ3NDQ5NTQ3NDc1MjM_c28jQ4MF8M0.mp3" },
			{ type: "music", vol: 0.2, fade: true,  start: 0, end: 19500, file: "music/SIP - Blitzkrieg Bop217844-4c64f818-88bc-4cc1-b6b7-dc77ba241e81.mp3" },
			{ type: "music", vol: 0.4, fade: true,  start: 0, end: 19500, file: "music/lets-get-ready-to-rumble-88035-f4d7d1a6-dd49-435a-955e-de52157812be.mp3" }
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
			//"announcer/be-post-game-show-NTg3MTU4OTM5NTg3MjAx_9RYro5iSkmA.MP3"
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
			{ type: "cheer", volMax: .75, file: "large-audience-medium-applause_MyTixHNO.mp3" },
			{ type: "cheer", volMax: .75, file: "screaming-teenage-girls-short_zJmNSSEu.mp3" },
			{ type: "cheer", volMax: .75, file: "stadium-applause_GJxblfEd.mp3" },
			{ type: "cheer", volMax: .75, file: "stadium-crowd-cheer-1_fJJQlMVu.mp3" },
			{ type: "cheer", volMax: .75, file: "stadium-crowd-cheer-2_zJ7SezVu.mp3" },
			{ type: "cheer", volMax: .75, file: "stadium-reaction-3_fkr4lG4u.mp3" },
		],
		cheerLong : [
			{ type: "cheer", volMax: .75, file: "huge-crowd-response_Mys7gfEu.mp3" },
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
