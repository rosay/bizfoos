var Player = require('./models/player');

module.exports = function(app) {
	// Routes
	app.post('/api/players', function (req, res) {

		Player.find(function(err, players) {
			if (err) {
				res.send(err);
			}
			res.json(players);
		});
	});

	app.get('/api/', function (req, res) {
		res.send('Hello World!');
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
