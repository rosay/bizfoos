var Game = require('../models/Game');
var Player = require('../models/Player');

var PlayerRpi = function () {
    var playerQuery = [
        { $group:
            {
                _id: "$_id"
            }
        }
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
        return Game.aggregate(gameQuery);
    };

    var getGameQuery = function () {
        return Player.aggregate(playerQuery);
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
            player.TotalWP = 0;
            player.OWP = 0;
            player.TotalOWP = 0;
            player.TWP = 0;
            player.TotalTWP = 0;

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

                        player.TotalWP += 1;
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
                            player.TotalTWP += 1;
                        }
                        if (player.Opponents.indexOf(game.Players[i].player_id) != -1)
                        {
                            if (game.Players[i].team == game.Players[i].winningteam)
                            {
                                player.OWP += 1;
                            }
                            player.TotalOWP += 1;
                        }
                    }
                }

            });

            if (player.TotalWP != 0)
            {
                player.WP  = player.WP  / player.TotalWP;
                player.TWP = player.TWP / player.TotalTWP;
                player.OWP = player.OWP / player.TotalOWP;
            }

        });
        playerResults.forEach(function(player) {

            player.OOWP = 0;
            player.TotalOOWP = 0;

            gameResults.forEach(function(game) {

                team = 0;

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

                            player.TotalOOWP += 1;
                        }
                    }
                }

            });

            if (player.TotalOOWP != 0)
            {
                player.OOWP = player.OOWP / player.TotalOOWP;
            }

        });
        playerResults.forEach(function(player) {
            player.RPI = (player.WP * 0.25) + (player.OWP * 0.50) + (player.OOWP * 0.25) + ((1 - player.TWP) * 0);

        });

        return playerResults.sort(function(a, b) {
            return (b.RPI > a.RPI) ? 1 : ((b.RPI < a.RPI) ? -1 : 0);
        });
    };

    return {
        getPlayerQuery: getPlayerQuery,
        getGameQuery: getGameQuery,
        processResults: processResults
    }
};

module.exports = PlayerRpi;