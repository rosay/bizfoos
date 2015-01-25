var Games = db.games.aggregate([
     { $unwind: "$roster" }
    ,{ $group: { 
        _id: "$_id" ,
        Teammates: { $push:  { player_id: "$roster.player_id", team: "$roster.team", winningteam: "$winningTeam", starttime: "$startTime" } },        
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
     
var PlayerNames = db.players.aggregate( [
   { $group : { _id : { player_id : "$_id", name : "$name" } } },
] )     

// Create an array of teamates and opponents for each player
Players.result.forEach(function(player) {
    
    player.Teammates = [];
    player.Opponents = [];
    
    Games.result.forEach(function(game) {
        
        var d = new Date();
        d.setMonth(d.getMonth() - 1);       
        
        if (game.Players[0].starttime > d)
        {

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
        }
        
    });
    
});

// Calculate each player's 
//      wp = winning percentage
//      owp = opponents winning percentage
//      twp = teammates winning percentage
Players.result.forEach(function(player) {
    
    player.WP = 0;
    player.TotalGames = 0;
    player.OWP = 0;
    TotalOWP = 0;
    player.TWP = 0;
    TotalTWP = 0;
    
    Games.result.forEach(function(game) {
        
        var d = new Date();
        d.setMonth(d.getMonth() - 1);
        
        if (game.Players[0].starttime > d)
        {        
        
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
        }
        
    });
    
    if (player.TotalGames != 0)
    {
        player.WP  = player.WP  / player.TotalGames;
        player.TWP = player.TWP / TotalTWP;
        player.OWP = player.OWP / TotalOWP;
    }
    
});

// Calculate each player's 
//      oowp = opponent's opponent's winning percentage
Players.result.forEach(function(player) {
    
    player.OOWP = 0;
    TotalOOWP = 0;
    
    Games.result.forEach(function(game) {
        
        var d = new Date();
        d.setMonth(d.getMonth() - 1);
        
        if (game.Players[0].starttime > d)
        {        
        
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
                        
                        TotalOOWP += 1;
                    }
                }  
            }
        }
        
    });
    
    if (TotalOOWP != 0)
    {
        player.OOWP = player.OOWP / TotalOOWP;
    }
    
});

Players.result.forEach(function(player) {
    
    PlayerNames.result.forEach(function(playername) {
        if (playername._id.player_id == player._id)
        {
            player.Name = playername._id.name;
        }    
    });    

    player.RPI = ((player.WP * 0.25) + (player.OWP * 0.25) + (player.OOWP * 0.25) + ((1-player.TWP) * 0.25)).toFixed(3);
    player.WP = (player.WP.toFixed(5) * 100) + "%";
    
});

//sort it
var sorted = Players.result.sort(function(a, b) {
        return (b.RPI > a.RPI) ? 1 : ((b.RPI < a.RPI) ? -1 : 0);
    });

Players