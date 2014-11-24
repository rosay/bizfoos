/**
 To load fake data into a test DB that can used by the app...
 Run this from your shell: mongo localhost:27017/bizfoosDevDb data_generators/all-data.js
 */

// === Debug settings ========================================================================

// === Clear out all data ======================================================================
db.players.remove({});
db.games.remove({});

// === Set variables ===========================================================================
var numberOfGames = 10;

var p1 = { "_id" : ObjectId("546ea25f602cb9ca83b290f6"), "name" : "Marky Mark" };
var p2 = { "_id" : ObjectId("546ea25f602cb9ca83b290f7"), "name" : "Mcbeev" };
var p3 = { "_id" : ObjectId("546ea25f602cb9ca83b290f8"), "name" : "Batman" };
var p4 = { "_id" : ObjectId("546ea25f602cb9ca83b290f9"), "name" : "CVB" };
var p5 = { "_id" : ObjectId("546ea25f602cb9ca83b290fa"), "name" : "Al" };
var p6 = { "_id" : ObjectId("546ea25f602cb9ca83b290fb"), "name" : "Dustin" };
var p7 = { "_id" : ObjectId("546ea25f602cb9ca83b290fc"), "name" : "Kevin" };
var p8 = { "_id" : ObjectId("546ea25f602cb9ca83b290fd"), "name" : "Blair" };
var p9 = { "_id" : ObjectId("546ea25f602cb9ca83b290fe"), "name" : "Dan" };
var p10 = { "_id" : ObjectId("546ea25f602cb9ca83b290ff"), "name" : "Cody" };

// === Players ======================================================================

// Load with defaults
db.players.insert(p1);
db.players.insert(p2);
db.players.insert(p3);
db.players.insert(p4);
db.players.insert(p5);
db.players.insert(p6);
db.players.insert(p7);
db.players.insert(p8);
db.players.insert(p9);
db.players.insert(p10);

// === Game Rosters ======================================================================
var rosters = [];

// Generate a list of rosters
for (var i = 0; i < numberOfGames; i++) {
	var roster = [];
	var teamAndPosition = 0;

	// Load up the roster
	while (roster.length < 4) {
		var player = db.players.find().skip(Math.floor(Math.random() * 10)).limit(1).toArray()[0];

		var isInGame = false;

		isInGame = roster.some(function(existingPlayer) {
			//print("is el === to player? " + el.toString() + " === " + player._id.toString());
			return existingPlayer.player_id.toString() === player._id.toString();
		});

		if (!isInGame) {
			// Assign team and position
			switch (teamAndPosition) {
				case 0:
					print(player.name + " on team 1 playing offense");
					roster.push({ player_id: player._id, team: 1, position: "offense" });
					break;
				case 1:
					print(player.name + " on team 1 playing defense");
					roster.push({ player_id: player._id, team: 1, position: "defense" });
					break;
				case 2:
					print(player.name + " on team 2 playing offense");
					roster.push({ player_id: player._id, team: 2, position: "offense" });
					break;
				case 3:
					print(player.name + " on team 2 playing defense");
					roster.push({ player_id: player._id, team: 2, position: "defense" });
					break;
			}
			teamAndPosition++;
		}
	}
	// END Load up the roster
	rosters.push(roster);
	print("Finished game " + i);
}

// === Scores ======================================================================
var scores = [];
for (var i = 0; i < numberOfGames; i++) {
	var score = [];

	// Create some random final scores to work with
	var teamOneFinalScore = 0;
	var teamTwoFinalScore = 0;

	if (Math.random() > .5) {
		teamOneFinalScore = 5;
		teamTwoFinalScore = Math.floor(Math.random() * 5); // Max 4
	} else {
		teamOneFinalScore = Math.floor(Math.random() * 5);
		teamTwoFinalScore = 5;
	}

	// Get game begin and end time
	var scoreTime;
	var now = new Date();
	var thirtyDaysAgo = new Date(new Date().getTime() - 30*24*60*60*1000);
	var maxGameLength = (10*60*1000);	// 10 mins
	var minGameLength = (5*60*1000);	// 5 mins

	// A random DateTime between now and thirty days ago
	var startGame = new Date(thirtyDaysAgo.getTime() + Math.random() * (now.getTime() - thirtyDaysAgo.getTime()));

	// A random time between startGame and 10 mins after Start game (min game length 5 mins)
	var endGame = new Date(startGame.getTime() + (Math.floor(Math.random() * (maxGameLength - minGameLength)) + minGameLength));

	// Assign scores to each player per team
	for(var j = 1; j <= teamOneFinalScore; j++) {
		scoreTime = new Date(startGame.getTime() + Math.random() * (endGame.getTime() - startGame.getTime()));

		score.push({
			player_id: Math.random() > .5 ? rosters[i][0].player_id : rosters[i][1].player_id,
			ScoreTime: scoreTime
		})
	}

	for(var k = 1; k <= teamTwoFinalScore; k++) {
		scoreTime = new Date(startGame.getTime() + Math.random() * (endGame.getTime() - startGame.getTime()));

		score.push({
			player_id: Math.random() > .5 ? rosters[i][2].player_id : rosters[i][3].player_id,
			ScoreTime: scoreTime
		});
	}
	printjson(score);
	scores.push(score);
}


// All done with games... load em up!
for (var i = 0; i < numberOfGames; i++) {
	print("Game 1 roster: " + rosters[i]);
	db.games.insert({roster: rosters[i], scores: scores[i]});
}
