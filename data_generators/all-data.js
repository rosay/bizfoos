/**
 To load fake data into a test DB that can used by the app...
 Run this from your shell: mongo localhost:27017/bizfoosDevDb data_generators/all-data.js
 */

// === Clean up ======================================================================
db.players.remove({});
db.games.remove({});
db.scores.remove({});

// === Players ======================================================================

// Load with defaults
db.players.insert({ name: "Marky Mark" });
db.players.insert({ name: "Mcbeev" });
db.players.insert({ name: "Batman" });
db.players.insert({ name: "CVB" });
db.players.insert({ name: "Al" });
db.players.insert({ name: "Dustin" });
db.players.insert({ name: "Kevin" });
db.players.insert({ name: "Blair" });
db.players.insert({ name: "Dan" });
db.players.insert({ name: "Cody" });

// === Games ======================================================================
// Generate some random games
for (var i = 0; i < 20; i++) {
	var game = [];

	while (game.length < 4) {
		var player = db.players.find().skip(Math.floor(Math.random() * 10)).limit(1).toArray()[0];

		var isInGame = false;

		isInGame = game.some(function(el) {
			//print("is el === to player? " + el.toString() + " === " + player._id.toString());
			return el.toString() === player._id.toString();
		});

		//print("Is in game? " + isInGame);
		if (!isInGame) {
			//print("unique player: " + player.name);
			game.push(player._id);

		} else {
			//print("not unique: " + player.name)
		}
	}

	// Set scores
	var teamOneFinalScore = 0;
	var teamTwoFinalScore = 0;

	if (Math.random() > .5) {
		teamOneFinalScore = 5;
		teamTwoFinalScore = Math.floor(Math.random() * 5); // Max 4
	} else {
		teamOneFinalScore = Math.floor(Math.random() * 5);
		teamTwoFinalScore = 5;
	}

	db.games.insert({
		TeamOneOffense: game[0],
		TeamOneDefense: game[1],
		TeamTwoOffense: game[2],
		TeamTwoDefense: game[3],
		TeamOneFinalScore: teamOneFinalScore,
		TeamTwoFinalScore: teamTwoFinalScore
	});

	//print("Game: " + i);
}

// === Scores ======================================================================
var games = db.games.find().toArray();

games.forEach(function(game) {
	// Get game score for each team
	var teamOneScore = game.TeamOneFinalScore;
	var teamTwoScore = game.TeamTwoFinalScore;

	// TODO make this work
	var now = new Date();
	var thirtyDaysAgo = new Date(new Date().getTime() - 30*24*60*60*1000);
	var maxGameLength = (10*60*1000); // 10 mins
	var minGameLength = (5*60*1000); // 5 mins

	// A random DateTime between now and thirty days ago.
	var startGame = new Date(thirtyDaysAgo.getTime() + Math.random() * (now.getTime() - thirtyDaysAgo.getTime()));
	// A random time between startGame and 10 mins after Start game (min game length 5 mins)
	var endGame = new Date(startGame.getTime() + (Math.floor(Math.random() * (maxGameLength - minGameLength)) + minGameLength));
	// end TODO

	// Assign scores to each player per team
	for(var i = 1; i <= teamOneScore; i++) {
		db.scores.insert({
			player_Id: Math.random() > .5 ? game.TeamOneOffense : game.TeamOneDefense,
			game_Id: game._id,
			ScoreTime: new Date()
		})
	}

	for(var i = 1; i <= teamTwoScore; i++) {
		db.scores.insert({
			player_Id: Math.random() > .5 ? game.TeamTwoOffense : game.TeamTwoDefense,
			game_Id: game._id,
			ScoreTime: new Date()
		})
	}
});
