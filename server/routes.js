var Player = require('./models/Player');
var Game = require('./models/Game');

var async = require('async');

var getDuration = require('./QueryHelpers/Duration');
var PlayerGames = require('./Queries/AllPlayerGames');
var PlayerPoints = require('./Queries/AllPlayerPoints');
var GamesCount = require('./Queries/GamesCount');

module.exports = function(app) {
	// Routes
	app.get('/api/players', function (req, res) {

		Player.find({}).sort({name: 1}).exec(function(err, players) {
			if (err) {
				res.send(err);
			}
			res.json(players);
		});
	});

	app.get('/api/stats/topplayers', function (req, res) {

		Game.aggregate([
			{ $unwind: "$roster" }
				,{ $group: {
					_id: "$roster.player_id" ,
					TotalGamesPlayed: { $sum: 1 },
					TotalGamesWon: { $sum: { $cond: { if: { $eq: ["$winningTeam", "$roster.team"] }, then: 1, else: 0 } } }
				}
			}
			,{ $project: {
				Player: "$roster.player_id",
				TotalGamesPlayed: "$TotalGamesPlayed",
				TotalGamesWon: "$TotalGamesWon",
				WinningPercentage: { $divide: ["$TotalGamesWon", "$TotalGamesPlayed" ]}
			}
			}
			,{ $sort: {
				"WinningPercentage":-1, "TotalGamesPlayed":1
			}
			}
		], function(err, result){
			if (err) {
				res.send(err);
			}
			res.json(result);
		});
	});

	app.get('/api/stats/players', function (req, res) {
		var agCallback = function (err, results) {
			if (err) {
				res.send(err);
			}
			callback(results);
		};

		async.parallel({
			playerPoints: function(callback) {
				PlayerPoints.exec(callback);
			},
			playerGames: function(callback) {
				PlayerGames.exec(callback);
			},
			gamesCount: function(callback) {
				GamesCount.exec(callback);
			}
		}, function (err, results) {
			results.playerGames.forEach(function(item) {

				var playerPointData = results.playerPoints.filter(function(entry) {
					return (entry._id == item._id)
				});

				item.AllGames = results.gamesCount;
				item.TotalOffensivePoints = playerPointData[0].TotalPointsOnOffense;
				item.TotalDefensivePoints = playerPointData[0].TotalPointsOnDefense;
				item.TotalPoints = item.TotalOffensivePoints + item.TotalDefensivePoints;

				item.AverageOffensivePointsPerGame = item.TotalOffensivePoints / item.TotalGamesPlayed;
				item.AverageDefensivePointsPerGame = item.TotalDefensivePoints / item.TotalGamesPlayed;
				item.AveragePointsPerGame          = item.TotalPoints          / item.TotalGamesPlayed;

				item.TotalGameTime = getDuration(item.TotalGameTimeMS, false);
				item.TotalOffensiveGameTime = getDuration(item.TotalOffensiveGameTimeMS, false);
				item.TotalDefensiveGameTime = getDuration(item.TotalDefensiveGameTimeMS, false);
				item.AverageGameTime = getDuration(item.TotalGameTimeMS / item.TotalGamesPlayed, false, true, true, false, false, false);
				item.AverageOffensiveGameTime = getDuration(item.TotalOffensiveGameTimeMS / item.TotalGamesOnOffense, false, true, true, false, false, false);
				item.AverageDefensiveGameTime = getDuration(item.TotalDefensiveGameTimeMS / item.TotalGamesOnDefense, false, true, true, false, false, false);
				item.AverageOffensiveGameTimeAfterLoss = getDuration(item.TotalOffensiveGameTimeAfterLossMS / item.TotalGamesLostOnOffense, false, true, true, false, false, false);
				item.AverageOffensiveGameTimeAfterWin = getDuration(item.TotalOffensiveGameTimeAfterWinMS / item.TotalGamesWonOnOffense, false, true, true, false, false, false);
				item.AverageDefensiveGameTimeAfterLoss = getDuration(item.TotalDefensiveGameTimeAfterLossMS / item.TotalGamesLostOnDefense, false, true, true, false, false, false);
				item.AverageDefensiveGameTimeAfterWin = getDuration(item.TotalDefensiveGameTimeAfterWinMS / item.TotalGamesWonOnDefense, false, true, true, false, false, false);
			});

			//sort it
			var sorted = results.playerGames.sort(function(a, b) {
				return (b.AveragePointsPerGame > a.AveragePointsPerGame) ? 1 : ((b.AveragePointsPerGame < a.AveragePointsPerGame) ? -1 : 0);
			});

			res.send(sorted);
		});
	});

	app.post('/api/game/save', function(req, res) {

		var game = new Game(req.body.gameData);

		if (game != null && game.roster.length === 4 && game.scores.length >= 5) {

			game.dateCreated = new Date();
			game.dateModified = new Date();

			game.save(function(err) {
				if (err) {
					// If it failed, return error
					res.status(500).send(err);
				}
				else {
					// We're good!
					res.status(201).send("Game created successfully");
				}
			});
		} else {
			res.status(500).send(err);
		}
	});

	// accept PUT request at /user
	app.put('/api/user', function (req, res) {
		res.send('Got a PUT request at /user');
	});

	// accept DELETE request at /user
	app.delete('/api/user', function (req, res) {
		res.send('Got a DELETE request at /user');
	});

	app.get('*', function(req, res) {
		res.sendFile('/client/index.html'); // load the single view file (angular will handle the page changes on the front-end)
	});
};
