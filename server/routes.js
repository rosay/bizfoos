var Player = require('./models/Player');
var Team = require('./models/Team');
var Game = require('./models/Game');
var async = require('async');

var GamesCountQuery = require('./queries/GamesCount');
var Rpi = require('./queries/PlayerRpi');
var PlayerStats = require('./queries/PlayerStats');

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

    app.get('/api/teamNames', function (req, res) {

        Team.find({}).exec(function(err, teams) {
            if (err) {
                res.send(err);
            }
            res.json(teams);
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

	app.post('/api/stats/rpi', function (req, res) {
		var dateRange = { fromDate: req.body.fromDate, toDate: req.body.toDate };

		if (dateRange.fromDate && dateRange.toDate) {
			var rpi = Rpi();

			async.parallel({
				player: function(callback) {
					rpi.getPlayerQuery().exec(callback);
				},
				games: function(callback) {
					rpi.getGameQuery(dateRange).exec(callback);
				}
			}, function (err, results) {

				var rpiResults = rpi.processResults(results.games, results.player);

				res.send(rpiResults);
			});
		} else {
			res.status(500).send("Missing To or From date");
		}
	});

	app.get('/api/stats/players', function (req, res) {
		var playerStats = PlayerStats();

		async.parallel({
			games: function(callback) {
				playerStats.getGamesQuery().exec(callback);
			},
			players: function(callback) {
				playerStats.getPlayersQuery().exec(callback);
			},
			gamesCount: function(callback) {
				GamesCountQuery.exec(callback);
			}
		}, function (err, results) {
			var playerStatsResults = playerStats.processResults(results.games, results.players, results.gamesCount);

			res.send(playerStatsResults);

		});
	});

	app.get('/api/stats/players/:player_id', function (req, res) {
		var player_id = req.params.player_id;

		var playerStats = PlayerStats();

		async.parallel({
			games: function(callback) {
				playerStats.getGamesQuery(player_id).exec(callback);
			},
			players: function(callback) {
				playerStats.getPlayersQuery(player_id).exec(callback);
			},
			gamesCount: function(callback) {
				GamesCountQuery.exec(callback);
			}
		}, function (err, results) {
			var playerStatsResults = playerStats.processResults(results.games, results.players, results.gamesCount);

			res.send(playerStatsResults);
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

	app.get('*', function(req, res) {
		res.sendFile('/client/index.html'); // load the single view file (angular will handle the page changes on the front-end)
	});
};
