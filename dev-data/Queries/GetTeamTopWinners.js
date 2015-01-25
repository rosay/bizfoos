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
     
var PlayerNames = db.players.aggregate( [
   { $group : { _id : { player_id : "$_id", name : "$name" } } },
] )       

// Create an array of teamates and opponents for each player
Players.result.forEach(function(player) {
    
    var index = 0;
    var result = 0;
    player.Teammates = [];
    
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
                        
                         index = -1;
                        
                         for(var j = 0; j < player.Teammates.length; j++) {
                            if(player.Teammates[j].Teammate == game.Players[i].player_id) {
                                index = j;
                            }
                         }
                         
                         //index = player.Teammates.indexOf(game.Players[i].player_id);
                        
                         result = (team == game.Players[i].winningteam) ? 1 : 0;

                         if (index == -1)
                         {
                            if (result == 1)
                            {
                                player.Teammates.push( { Teammate: game.Players[i].player_id, Games: 1, Wins: 1, Losses: 0, WP: ((result/1) * 100) } );
                            }
                            else
                            {
                                player.Teammates.push( { Teammate: game.Players[i].player_id, Games: 1, Wins: 0, Losses: 1, WP: ((result/1) * 100) } );
                            }
                         }
                         else
                         {
                            if (result == 1)
                            {
                                player.Teammates[index].Wins += 1;
                            }
                            else
                            {
                                player.Teammates[index].Losses += 1;
                            }                            
                            player.Teammates[index].Games += 1;
                            player.Teammates[index].WP = (player.Teammates[index].Wins / player.Teammates[index].Games) * 100;
                         }
                    }                  
                }            
            }  
        }
    });
    
    player.Teammates.sort(function(a, b){
        //return a.WP-b.WP;
        return (b.WP > a.WP) ? 1 : ((b.WP < a.WP) ? -1 : 0);
    });
    
});

Players