var Player = require('./models/Player');
var Game = require('./models/Game');

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

	app.post('/api/lb/topplayers', function (req, res) {

		Player.find(function(err, players) {
			if (err) {
				res.send(err);
			}

			res.json(players);
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
		res.sendFile('/src/index.html'); // load the single view file (angular will handle the page changes on the front-end)
	});
};
