var dateFrom = new Date('1/1/2015');
var dateTo   = new Date('1/21/2015');

//dateFrom

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
        }
     }
 }
 //   ,{ $match: { "dateCreated" : { /*$gte : dateFrom, */ $lt : ISODate("2020-04-13T12:00:00.000Z") } } }
    ,{ $project: {
        Player: "$roster.player_id",
        TotalPointsOnOffense: "$TotalPointsOnOffense",
        TotalPointsOnDefense: "$TotalPointsOnDefense"
    }
}
]);


//PlayerPoints

var PlayerGames = db.games.aggregate([
     { $unwind: "$roster" }
    ,{ $group: { 
        _id: "$roster.player_id" ,
        TotalGames: { $sum: 1 },
        TotalGameLengthInSeconds: { $sum: { $subtract: [ "$endTime", "$startTime"] } }
        } 
     }
    ,{ $project: {
        Player: "$roster.player_id",
        TotalGames: "$TotalGames",
        TotalGameLengthInSeconds: "$TotalGameLengthInSeconds"
        }
    }
//    ,{ $match: { startDate : { $gte : "$dateFrom", $lte : "$dateTo" } } }
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
    
    
    item.TotalGameLengthInSeconds      = (item.TotalGameLengthInSeconds / 1000);
    item.AverageGameLengthInSeconds    = item.TotalGameLengthInSeconds / item.TotalGames;
    item.AverageGameLengthInMinutes    = (item.TotalGameLengthInSeconds / item.TotalGames) / 60.0;
    
});

//sort it
var sorted = PlayerGames.result.sort(function(a, b) {
        return (b.AveragePointsPerGame > a.AveragePointsPerGame) ? 1 : ((b.AveragePointsPerGame < a.AveragePointsPerGame) ? -1 : 0);
    });

PlayerGames
