// todo: treat this as a service, along with random, talk to Cody
var sayThisData = {
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
			"And now {{name}} is scoring points for {{team}}"
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
		twoPoints : [
			 "That's two in a row by {{name}}"
			 ,"{{name}} {knocks/smacks/hits} another one in, {he has/that's/that makes} 2 in a row."
			//,"wav:and_another_one.wav"
		],
		threePoints : [
			"That's three in a row by {{team}}"
			,"{{team}} with another goal. 3 point streak."
			,"And they sink another one. Three in a row by {{team}}"
			//,"wav:and_another_one.wav"
		],
		fourPoints : [
			"{{name}} is going streaking! That's a quad-point streak."
			,"{{name}} with another point. That's a 4 goals streak!"
			//,"wav:and_another_one.wav"
		],
		fivePoints : [
		],
		multiplePoints : [
			"And another shot by {{name}}"
			,"{{name}} with another goal"
			,"{{name}} sinks another one"
			,"{{name}} drops another one"
			//,"wav:and_another_one.wav"
		]
	},

	teamStreak : {
		twoPoints : [
			 "That's two in a row by {{team}}"
			 ,"{{team}} {{team{is|are}}} on a roll"
			//,"wav:and_another_one.wav"
		],
		threePoints : [
			"That's three in a row by {{team}}"
			,"{{team}} with another goal. 3 point streak."
			,"And they sink another one. Three in a row by {{team}}"
			//,"wav:and_another_one.wav"
		],
		fourPoints : [
		],
		fivePoints : [
		],
		multiplePoints : [
			"And another goal by {{team}}"
			,"{{team}} with another goal"
			,"{{team}} sink{{team{s|}}} another one"
			,"{{team}} drop{{team{s|}}} another one"
		],
	},

	player: {
		score: [
			 "{{name}} scores a goal"
			,"{{name}} puts one in"
			,"{{name}} sinks one"
			//,"wav:and_another_one.wav"
		],
		//  TODO: weak "dribble in" shots
		highPowerShot: [ /* not used yet */
			,"Power Shot from {{name}}"
			,"{{name}} slams one in"
			,"{{name}} slams one down {{other-team-defense}}'s throat"
		],
		highPowerShotDefensive: [ /* not used yet */
			,"It's {{name}}! from down town"
			,"{{name}} pounds on {{other-team-defense}} from {the back/the d-fense}"
			,"d-fense, d-fense, d-fense with the score!"
		]
	},

	team: {
		score: [
			 "{{team}} score{{team{s|}}} a goal"
			,"{{team}} put{{team{s|}}} one in"
			,"{{team}} sink{{team{s|}}} one"
			//,"wav:and_another_one.wav"
		],
		approachingShutOutAlert: [
			 "{{team}} {{team{is|are}}} {putting the hurt on {{other-team}}/gaining a solid lead/working on a shut out/sticking it to {{other-team}}}"
			 ,"{Ouch/Snap/Dang/Hey Now/Oh man/Wow/Look Out/It's On now}, {{other-team}} {{other-team{is|are}}} {in the danger zone now/on their way to a shut out/in need of some points}"
			 ,"{Ouch/Snap/Dang/Hey Now/Oh man/Wow/Look Out/It's On now}, {{other-team}} {need{{other-team{s|}}} to catch up/need{{other-team{s|}}} to make up some points/need{{other-team{s|}}} their first point/{{other-team{is|are}}} way behind now/{{other-team{is|are}}} falling behind}"
			 ,"{{other-team}} {{other-team{has|have}}} some {catching up to do/work to do}"
		],
		shutOutAlert: [
			 "And we have a shut out alert for {{other-team}}"
			//,"wav:shut_out_alert.wav"
		]
	},


	//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
	// Options for annoncing throughout the game
	// player scores and it took over 2 minutes
	// "Wow, that point took some effort"
	// "That point took some time, {{name}} should get extra points for that shot"
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
			//,"sound:charge"
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



	reportScore: {
		generic: [
			 "{We have/Score is} {{team}} with {{team-score}} and {{other-team}} with {{other-team-score}}"
		],
		teamWinning: [
			 "{{team}} {{team{is|are}}} winning {{team-score}} to {{other-team-score}}"
			 ,"It's {{team}} over {{other-team}} with a {{team-score}} to {{other-team-score}} lead."
			 ,"{The Score is/We are at/And it is/We're at/The Score board says} {{team-score}} to {{other-team-score}} with {{team}} {leading the drive/on top/out in front}."
		],
		teamLosing: [
			 "{{team}} {{team{is|are}}} losing {{team-score}} to {{other-team-score}}"
			 ,"It's {{other-team}} over {{team}} with a {{other-team-score}} to {{team-score}} lead."
			 ,"{The Score is/We are at/And it is/We're at/The Score board says} {{other-team-score}} to {{team-score}} with {{other-team}} {leading the drive/on top/out in front}."
			 ,"{The Score is/We are at/And it is/We're at/The Score board says} {{other-team-score}} to {{team-score}} with {{team}} {trailing behind/at the bottom/trying to catch up/needing to gain some points}."
		],
		tiedScore: [
			 "Score is {tied/all tied} up at {{team-score}} to {{other-team-score}}"
			 ,"{And we are/The scores are/It's all} tied up at {{team-score}} to {{other-team-score}}"
			 ,"And the scores are at {{team-score}} and {{other-team-score}}"
			 ,"{All tied up at/we're even with a score of/It's anyones game with a score of} {{team-score}} and {{other-team-score}}"
		],
		tiedScoreNextPointWins: [
			"{And now/OK boys and girls,} it just got real {{team-score}} to {{other-team-score}}"
			,"{We have/And now it's} fours all around, next point wins"
			,"It's on. It's on like donkey kong. The Next {point/score/goal} ends {the game/this battle}."
			,"And fours all around, next point wins"
		]
	},

	finalPoint: {
		generic: [
			"{{name}} {puts in/with/drops in/knocks in/scores/sinks} the final {point/score/goal} against {{other-team}} giving {{team}} yet another {victory/win} with a final score of {{team-score}} to {{other-team-score}}."
			,"And {that ends/that is the end of} the game for {{other-team}}, giving {{team}} yet another {victory/win}. The final score is {{team-score}} to {{other-team-score}}."
			,"{And that is the end of the game/And that's all folks/And that brings this game to a conclusion}. {{other-team}} {{other-team{has|have}}} been {beaten/defeated} by {{team}} with a {{team-score}} to {{other-team-score}} {victory/win}."
			//,"wav:and_another_one.wav"
		],
		closeGame: [
			"And the {final/last/winning} {point/goal/score} by {{name}} finishes out {a close game/a nail-biter/an intense match-up} defeating {{other-team}}"
			,"{And that is the end of the game/And that's all folks/And that brings this game to a conclusion}. {{other-team}} {{other-team{has|have}}} been {beaten/defeated} by {{team}} in a {very close match/tight game/close match/very close game} with a {{team-score}} to {{other-team-score}} {victory/win}."
			,"{And that is the end of the game/And that's all folks/And that brings this game to a conclusion}. {{team}} {{team{has|have}}} {beaten/defeated/won over} {{other-team}} in a {very close match/tight game/close match/very close game} with a {{team-score}} to {{other-team-score}} {victory/win}."
			,"{And that is the end of the game/And that's all folks/And that brings this game to a conclusion}. {{team}} {{team{has|have}}} won in a {very close match/tight game/close match/very close game} with a {{team-score}} to {{other-team-score}} {victory/win} over {{other-team}}."
			//,"And the {final/last/winning} {point/goal/score} by {{name}} finishes out {a close game/a nail-biter/an intense match-up} defeating {{other-team}}"
			//,"wav:and_another_one.wav"
		],
		shutOut: [
			"{{name}} with the final {nail in the coffin/score/goal} against the {{other-team}} gives {{team}} yet another {shut out/crushing 5 to 0 victory/devastating 5 and O victory}."
			,"{And that is the end of the game/And that's all folks/And that brings this game to a conclusion}. {{other-team}} {{other-team{has|have}}} been {shut out/blanked/crushed/annihilated/demolished} by {{team}}"
			//,"wav:and_another_one.wav"
		],
	},

	//TODO: if you are putting in all the points, talk about carrying your team mate
	//  it would be really nice to know about fooses



}
