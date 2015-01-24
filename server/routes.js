var Player = require('./models/Player');
var Game = require('./models/Game');
var async = require('async');

var QueryHelper = require('./QueryHelpers/QueryHelper');
var PlayerGamesQuery = require('./Queries/PlayerGames');
var PlayerPointsQuery = require('./Queries/PlayerPoints');
var GamesCountQuery = require('./Queries/GamesCount');

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
		var playerGamesQuery = PlayerGamesQuery();
		var playerPointsQuery = PlayerPointsQuery();
		var queryHelper = QueryHelper();

		async.parallel({
			playerGames: function(callback) {
				playerGamesQuery.getQuery().exec(callback);
			},
			playerPoints: function(callback) {
				playerPointsQuery.getQuery().exec(callback);
			},
			gamesCount: function(callback) {
				GamesCountQuery.exec(callback);
			}
		}, function (err, results) {
			var playerResults = [];

			results.playerGames.forEach(function(player) {
				var playerPointData = results.playerPoints.filter(function(entry) {
					return (entry._id == player._id)
				});

				var playerResult = queryHelper.getPlayerResults(player, playerPointData[0], results.gamesCount);

				playerResults.push(playerResult);
			});

			res.send(
				// sort the results and send
				playerResults.sort(function(a, b) {
					return (b.AveragePointsPerGame > a.AveragePointsPerGame) ? 1 : ((b.AveragePointsPerGame < a.AveragePointsPerGame) ? -1 : 0);
				})
			);
		});
	});

	app.get('/api/stats/players/:player_id', function (req, res) {
		var player_id = req.params.player_id;

		var playerGamesQuery = PlayerGamesQuery();
		var playerPointsQuery = PlayerPointsQuery();
		var queryHelper = QueryHelper();

		async.parallel({
			playerGames: function(callback) {
				playerGamesQuery.getQuery(player_id).exec(callback);
			},
			playerPoints: function(callback) {
				playerPointsQuery.getQuery(player_id).exec(callback);
			},
			gamesCount: function(callback) {
				GamesCountQuery.exec(callback);
			}
		}, function (err, results) {
			var playerResults = [];

			results.playerGames.forEach(function(player) {
				var playerPointData = results.playerPoints.filter(function(entry) {
					return (entry._id == player._id)
				});

				var playerResult = queryHelper.getPlayerResults(player, playerPointData[0], results.gamesCount);

				playerResults.push(playerResult);
			});

			res.send(
				// sort the results and send
				playerResults.sort(function(a, b) {
					return (b.AveragePointsPerGame > a.AveragePointsPerGame) ? 1 : ((b.AveragePointsPerGame < a.AveragePointsPerGame) ? -1 : 0);
				})
			);
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
