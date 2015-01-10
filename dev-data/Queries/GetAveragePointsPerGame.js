var PlayerPoints = db.games.aggregate([
     { $unwind: "$roster" }
    ,{ $unwind: "$scores" }
    ,{ $group: { 
        _id: "$roster.player_id" ,
        TotalPoints: { $sum: { $cond: { if: { $eq: ["$roster.player_id", "$scores.player_id"] }, then: 1, else: 0 } } },
        } 
     }
    ,{ $project: {
        Player: "$roster.player_id",
        TotalPoints: "$TotalPoints"
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
    item.TotalPoints = playerPointData[0].TotalPoints;
    item.AveragePointsPerGame = item.TotalPoints / item.TotalGames;
});

//sort it
var sorted = PlayerGames.result.sort(function(a, b) {
        return (b.AveragePointsPerGame > a.AveragePointsPerGame) ? 1 : ((b.AveragePointsPerGame < a.AveragePointsPerGame) ? -1 : 0);
    });

PlayerGames
