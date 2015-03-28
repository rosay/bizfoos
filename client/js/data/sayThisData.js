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

}
