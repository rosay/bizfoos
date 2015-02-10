/**
 To load fake data into a test DB that can used by the app...
 Run this from your shell: mongo localhost:27017/bizfoos data_generators/reset-dev-env-data.js
 */

// === Debug settings ========================================================================

// === Clear out all data ======================================================================
db.players.remove({});
db.games.remove({});

// === Set variables ===========================================================================
var numberOfGames = 100;

// === Players ======================================================================

// Load with defaults
db.players.insert({ _id: "logan@xi.com", name: "Logan", pic: "assets/playerpics/_logan.jpg" });
db.players.insert({ _id: "chalres@xi.com", name: "Charles", pic: "assets/playerpics/_charles.jpg" });
db.players.insert({ _id: "eric@xi.com", name: "Eric", pic: "assets/playerpics/_eric.jpg" });
db.players.insert({ _id: "jean@xi.com", name: "Jean", pic: "assets/playerpics/_jean.jpg" });
db.players.insert({ _id: "scott@xi.com", name: "Scott", pic: "assets/playerpics/_scott.jpg" });
db.players.insert({ _id: "marie@xi.com", name: "Marie", pic: "assets/playerpics/_rogue.jpg" });
db.players.insert({ _id: "gambit@xi.com", name: "Gambit", pic: "assets/playerpics/_gambit.jpg" });
a
// === Game Rosters ======================================================================
var rosters = [];

// Generate a list of rosters
for (var i = 0; i < numberOfGames; i++) {
	var roster = [];
	var teamAndPosition = 0;

	// Load up the roster
	while (roster.length < 4) {
		var player = db.players.find().skip(Math.floor(Math.random() * 7)).limit(1).toArray()[0];

		var isInGame = false;

		isInGame = roster.some(function(existingPlayer) {
			//print("is el === to player? " + el.toString() + " === " + player._id.toString());
			return existingPlayer.player_id.toString() === player._id.toString();
		});

		if (!isInGame) {
			// Assign team and position
			switch (teamAndPosition) {
				case 0:
					//print(player.name + " on team 1 playing offense");
					roster.push({ player_id: player._id, team: 1, position: "offense" });
					break;
				case 1:
					//print(player.name + " on team 1 playing defense");
					roster.push({ player_id: player._id, team: 1, position: "defense" });
					break;
				case 2:
					//print(player.name + " on team 2 playing offense");
					roster.push({ player_id: player._id, team: 2, position: "offense" });
					break;
				case 3:
					//print(player.name + " on team 2 playing defense");
					roster.push({ player_id: player._id, team: 2, position: "defense" });
					break;
			}
			teamAndPosition++;
		}
	}
	// END Load up the roster
	rosters.push(roster);
	//print("Finished game " + i);
}

// === Scores ======================================================================
var scores = [];
var gameStartTimes = [];
var gameEndTimes = [];
var winningTeams = [];
for (var i = 0; i < numberOfGames; i++) {
	var score = [];
	var scoreTimes = [];
	var winningTeam;

	// Create some random final scores to work with
	var teamOneFinalScore = 0;
	var teamTwoFinalScore = 0;

	if (Math.random() > .5) {
		winningTeam = 1;
		teamOneFinalScore = 5;
		teamTwoFinalScore = Math.floor(Math.random() * 5); // Max 4
	} else {
		winningTeam = 2;
		teamOneFinalScore = Math.floor(Math.random() * 5);
		teamTwoFinalScore = 5;
	}

	winningTeams.push(winningTeam);

	// Get game begin and end time
	var scoreTime;
	var now = new Date();
	var thirtyDaysAgo = new Date(new Date().getTime() - 30*24*60*60*1000);
	var maxGameLength = (10*60*1000);	// 10 mins
	var minGameLength = (5*60*1000);	// 5 mins

	// A random DateTime between now and thirty days ago
	var startGame = new Date(thirtyDaysAgo.getTime() + Math.random() * (now.getTime() - thirtyDaysAgo.getTime()));

	// A random time between startGame and 10 mins after Start game (min game length 5 mins)
	var gameEndBoundary = new Date(startGame.getTime() + (Math.floor(Math.random() * (maxGameLength - minGameLength)) + minGameLength));

	// Assign scores to each player per team
	for(var j = 1; j <= teamOneFinalScore; j++) {
		scoreTime = new Date(startGame.getTime() + Math.random() * (gameEndBoundary.getTime() - startGame.getTime()));
		scoreTimes.push(scoreTime);

		score.push({
			player_id: Math.random() > .5 ? rosters[i][0].player_id : rosters[i][1].player_id,
			scoreTime: scoreTime
		})
	}

	for(var k = 1; k <= teamTwoFinalScore; k++) {
		scoreTime = new Date(startGame.getTime() + Math.random() * (gameEndBoundary.getTime() - startGame.getTime()));
		scoreTimes.push(scoreTime);

		score.push({
			player_id: Math.random() > .5 ? rosters[i][2].player_id : rosters[i][3].player_id,
			scoreTime: scoreTime
		});
	}

	gameStartTimes.push(startGame);

	var endGame = new Date(Math.max.apply(null,scoreTimes));
	gameEndTimes.push(endGame);

	//printjson(score);
	scores.push(score);
}


// All done with games... load em up!
for (var i = 0; i < numberOfGames; i++) {
	//print("Game 1 roster: " + rosters[i]);
	var date = new Date();
	date.setDate(date.getDate() - i);

	db.games.insert({roster: rosters[i], scores: scores[i], startTime: gameStartTimes[i], endTime: gameEndTimes[i], winningTeam: winningTeams[i], dateCreated: date, dateModified: date});
}
