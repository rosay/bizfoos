var AllShutOutGames = db.games.aggregate([
     { $unwind: "$scores" }
    ,{ $unwind: "$roster" }
    ,{ $group: { 
        _id: "$_id" ,
        TotalPointsByTheLosingTeam: { $sum: { $cond: { if: 
            { "$and": [
                /*{ $eq: ["$roster.player_id", "$scores.player_id"] }
                ,*/{ $ne: ["$scores.team", "$winningTeam"] }
            ]}
            , then: 1, else: 0 } } 
        }
    }
    }
    ,{ $match : { TotalPointsByTheLosingTeam : { $eq : 0 } } }
]);


//AllShutOutGames;
//AllShutOutGames.result[0];
var GameIDs = AllShutOutGames.result.map(function(item) {
    return item._id;
  })

//  GameIDs;

// all game OBJECTS that are shut-outs
var ShutOutGames = db.games.find({_id: { $in: GameIDs}})

var PlayersThatShutOthersOut = [];
var PlayersThatGotShutOut = [];

ShutOutGames.forEach(function(item) {
    item.roster.forEach(function(player) {
        if (player.team == item.winningTeam)
            PlayersThatShutOthersOut[player.player_id] = (PlayersThatShutOthersOut[player.player_id] || 0) + 1;
        else
            PlayersThatGotShutOut[player.player_id] = (PlayersThatGotShutOut[player.player_id] || 0) + 1;
    });
});

var sortByValue = function(a, b) {
    return (b > a) ? 1 : ((b < a) ? -1 : 0);
};


PlayersThatShutOthersOut = PlayersThatShutOthersOut.sort(sortByValue);
PlayersThatGotShutOut = PlayersThatGotShutOut.sort(sortByValue);


/*  
db.games.aggregate([
   { $unwind: "$roster" }
  ,{ $group : {
        _id: "$roster.player_id",
        count: { $sum: 1 }
     }
   }
  ,{ $project : {
        Player: "$roster.player_id"
        ,GameID: "$_id"
        ,count: "$count"
      }
  }
//  ,{ $match : { _id: { $in: GameIDs }} }
  ,{ $match : { winingTeam : { $ne : "$roster.team" } } }
]);
*/
