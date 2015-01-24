var Games = db.games.aggregate([

     { $unwind: "$roster" }

    ,{ $group: { 

        _id: "$_id" ,

        Teammates: { $push:  { player_id: "$roster.player_id", team: "$roster.team", winningteam: "$winningTeam" } },        

        } 

     }

    ,{ $project: {

        Players: "$Teammates",       

        }

    }

]) 

    

var Players = db.players.aggregate([

     { $group: { 

        _id: "$_id" ,        

        } 

     }

])   



Players.result.forEach(function(player) {

    

    player.Teammates = [];

    player.Opponents = [];

    

    Games.result.forEach(function(game) {



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



Players.result.forEach(function(player) {

    

    player.WP = 0;

    player.TotalWP = 0;

    player.OWP = 0;

    player.TotalOWP = 0;

    player.TWP = 0;

    player.TotalTWP = 0;

    

    Games.result.forEach(function(game) {

        

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



Players.result.forEach(function(player) {

    

    player.OOWP = 0;

    player.TotalOOWP = 0;

    

    Games.result.forEach(function(game) {

        

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

                    Players.result.forEach(function(otherPlayer) {

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



Players.result.forEach(function(player) {
    player.RPI = (player.WP * 0.25) + (player.OWP * 0.50) + (player.OOWP * 0.25) + ((1-player.TWP) * 0);
});



//sort it

var sorted = Players.result.sort(function(a, b) {

        return (b.RPI > a.RPI) ? 1 : ((b.RPI < a.RPI) ? -1 : 0);

    });



Players