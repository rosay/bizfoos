var Game = require('../models/Game');
var Player = require('../models/Player');

var PlayerRpi = function () {
    var playerQuery = [
        { $project : { _id : "$_id", name : "$name", pic: "$pic" } }
    ];

    var gameQuery = [
        { $unwind: "$roster" }
       ,{ $group:
            {
                _id: "$_id" ,
                Teammates: { $push:  { player_id: "$roster.player_id", team: "$roster.team", winningteam: "$winningTeam" } }
            }
        }
       ,{ $project:
            {
                Players: "$Teammates"
            }
        }
    ];

    var getPlayerQuery = function () {
        return Player.aggregate(playerQuery);
    };

    var getGameQuery = function (fromDate) {
        fromDate = fromDate || null;

        if (fromDate) {
            gameQuery.splice(0, 0, { $match: { dateCreated: { "$gt": new Date(fromDate) }} });
        }

        return Game.aggregate(gameQuery);
    };

    var processResults = function (gameResults, playerResults) {
        playerResults.forEach(function(player) {

            player.Teammates = [];
            player.Opponents = [];

            gameResults.forEach(function(game) {
                var team = 0;

                for (var i = 0; i < 4; i++)
                {
                    if (game.Players[i].player_id == player._id)
                    {
                        team = game.Players[i].team;
                    }
                }

                if (team != 0)
                {
                    for (var i = 0; i < 4; i++)
                    {
                        if (game.Players[i].player_id != player._id)
                        {
                            if (game.Players[i].team == team)
                            {
                                if (player.Teammates.indexOf(game.Players[i].player_id) == -1)
                                    player.Teammates.push( game.Players[i].player_id );
                            }
                            else
                            {
                                if (player.Opponents.indexOf(game.Players[i].player_id) == -1)
                                    player.Opponents.push( game.Players[i].player_id );
                            }
                        }
                    }
                }

            });

        });
        playerResults.forEach(function(player) {
            player.WP = 0;
            player.TotalGames = 0;
            player.OWP = 0;
            var TotalOWP = 0;
            player.TWP = 0;
            var TotalTWP = 0;

            gameResults.forEach(function(game) {

                playedInGame = 0;

                for (var i = 0; i < 4; i++)
                {
                    if (game.Players[i].player_id == player._id)
                    {
                        playedInGame = game.Players[i].team;

                        if(game.Players[i].team == game.Players[i].winningteam)
                        {
                            player.WP += 1;
                        }

                        player.TotalGames += 1;
                    }
                }

                if (playedInGame == 0)
                {
                    for (var i = 0; i < 4; i++)
                    {
                        if (player.Teammates.indexOf(game.Players[i].player_id) != -1)
                        {
                            if (game.Players[i].team == game.Players[i].winningteam)
                            {
                                player.TWP += 1;
                            }
                            TotalTWP += 1;
                        }
                        if (player.Opponents.indexOf(game.Players[i].player_id) != -1)
                        {
                            if (game.Players[i].team == game.Players[i].winningteam)
                            {
                                player.OWP += 1;
                            }
                            TotalOWP += 1;
                        }
                    }
                }

            });

            if (player.TotalGames != 0) {
                player.TotalGamesWon = player.WP;

				if (player.TotalGames != 0) {
					player.WP  = player.WP  / player.TotalGames;
				}
				if (TotalOWP != 0) {
					player.OWP = player.OWP / TotalOWP;
				}

				if (TotalTWP != 0) {
					player.TWP = player.TWP / TotalTWP;
				}
            }
        });
        playerResults.forEach(function(player) {

            player.OOWP = 0;
            var TotalOOWP = 0;

            gameResults.forEach(function(game) {

                var team = 0;

                for (var i = 0; i < 4; i++)
                {
                    if (game.Players[i].player_id == player._id)
                    {
                        team = game.Players[i].team;
                    }
                }

                if (team != 0) // Then this player was in the game
                {
                    for (var i = 0; i < 4; i++)
                    {
                        if (game.Players[i].player_id != player._id && game.Players[i].team != team)
                        {
                            //player.OOWP += Players;
                            playerResults.forEach(function(otherPlayer) {
                                if (otherPlayer._id == game.Players[i].player_id)
                                {
                                    player.OOWP += otherPlayer.OWP;
                                }
                            });

                            TotalOOWP += 1;
                        }
                    }
                }

            });

            if (TotalOOWP != 0)
            {
                player.OOWP = player.OOWP / TotalOOWP;
            }
        });
        playerResults.forEach(function(player) {
            player.RPI = ((player.WP * 0.25) + (player.OWP * 0.25) + (player.OOWP * 0.25) + ((1-player.TWP) * 0.25)).toFixed(3);
            player.WP = player.WP.toFixed(5);

        });

        return playerResults.sort(function(a, b) {
            return (b.RPI > a.RPI) ? 1 : ((b.RPI < a.RPI) ? -1 : 0);
        });
    };

    var runQueryInMongo = function () {
        var Players = db.players.aggregate(playerQuery);
        var Games = db.games.aggregate(gameQuery);

        return processResults(Games.result, Players.result);
    };

    return {
        getPlayerQuery: getPlayerQuery,
        getGameQuery: getGameQuery,
        processResults: processResults,
        runQueryInMongo: runQueryInMongo
    }
};

module.exports = PlayerRpi;
