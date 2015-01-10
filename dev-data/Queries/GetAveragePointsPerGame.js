var PlayerPoints = db.games.aggregate([
     { $unwind: "$roster" }
    ,{ $unwind: "$scores" }
    ,{ $group: { 
        _id: "$roster.player_id" ,
        TotalPointsOnOffense: { $sum: { $cond: { if: 
            { "$and": [
                { $eq: ["$roster.player_id", "$scores.player_id"] }
                ,{ $eq: ["$roster.position", "offense"] }
            ]}
            , then: 1, else: 0 } } 
        },
        TotalPointsOnDefense: { $sum: { $cond: { if: 
            { "$and": [
                { $eq: ["$roster.player_id", "$scores.player_id"] }
                ,{ $eq: ["$roster.position", "defense"] }
            ]}
            , then: 1, else: 0 } } 
        },
     }
 }
    ,{ $project: {
        Player: "$roster.player_id",
        TotalPointsOnOffense: "$TotalPointsOnOffense",
        TotalPointsOnDefense: "$TotalPointsOnDefense"
    }
}
]);

var PlayerGames = db.games.aggregate([
     { $unwind: "$roster" }
    ,{ $group: { 
        _id: "$roster.player_id" ,
        TotalGames: { $sum: 1 }
        } 
     }
    ,{ $project: {
        Player: "$roster.player_id",
        TotalGames: "$TotalGames"
        }
    }
])

PlayerGames.result.forEach(function(item) {
    var playerPointData = PlayerPoints.result.filter(function(entry) {
        return (entry._id == item._id)
    });
    item.TotalOffensivePoints = playerPointData[0].TotalPointsOnOffense;
    item.TotalDefensivePoints = playerPointData[0].TotalPointsOnDefense;
    item.TotalPoints = item.TotalOffensivePoints + item.TotalDefensivePoints;

    item.AverageOffensivePointsPerGame = item.TotalOffensivePoints / item.TotalGames;
    item.AverageDefensivePointsPerGame = item.TotalDefensivePoints / item.TotalGames;
    item.AveragePointsPerGame          = item.TotalPoints          / item.TotalGames;
});

//sort it
var sorted = PlayerGames.result.sort(function(a, b) {
        return (b.AveragePointsPerGame > a.AveragePointsPerGame) ? 1 : ((b.AveragePointsPerGame < a.AveragePointsPerGame) ? -1 : 0);
    });

PlayerGames
