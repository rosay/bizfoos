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
        TotalPointsAgainstOnDefense: { $sum: { $cond: { if: 
            { "$and": [
                { $ne: ["$roster.player_id", "$scores.player_id"] }
                ,{ $eq: ["$roster.position", "defense"] }
                ,{ $ne: ["$roster.team", "scores.team"] }
            ]}
            , then: 1, else: 0 } } 
        },      
     }
 }
    ,{ $project: {
        Player: "$roster.player_id",
        TotalPointsOnOffense: "$TotalPointsOnOffense",
        TotalPointsOnDefense: "$TotalPointsOnDefense",
        TotalPointsAgainstOnDefense: "$TotalPointsAgainstOnDefense"
    }
}
]);


var PlayerGames = db.games.aggregate([
     { $unwind: "$roster" }
    ,{ $group: { 
        _id: "$roster.player_id" ,      
        TotalGames: { $sum: 1 },
        TotalGamesWon: { $sum: { $cond: { if: { $eq: ["$winningTeam", "$roster.team"] }, then: 1, else: 0 } } },
        TotalGamesWonOnOffense: { $sum: { $cond: { if: 
            { "$and": [
                 { $eq: ["$winningTeam", "$roster.team"] }
                ,{ $eq: ["$roster.position", "offense"] }
            ]}
            , then: 1, else: 0 } }
        },
        TotalGamesWonOnDefense: { $sum: { $cond: { if: 
            { "$and": [
                 { $eq: ["$winningTeam", "$roster.team"] }
                ,{ $eq: ["$roster.position", "defense"] }
            ]}
            , then: 1, else: 0 } }
        },         
        TotalGamesLost: { $sum: { $cond: { if: { $eq: ["$winningTeam", "$roster.team"] }, then: 0, else: 1 } } },
        TotalGamesLostOnOffense: { $sum: { $cond: { if: 
            { "$and": [
                 { $ne: ["$winningTeam", "$roster.team"] }
                ,{ $eq: ["$roster.position", "offense"] }
            ]}
            , then: 1, else: 0 } }
        },
        TotalGamesLostOnDefense: { $sum: { $cond: { if: 
            { "$and": [
                 { $ne: ["$winningTeam", "$roster.team"] }
                ,{ $eq: ["$roster.position", "defense"] }
            ]}
            , then: 1, else: 0 } }
        },        
        TotalGameTimeMS: { $sum: { $subtract: ["$endTime", "$startTime"] } },
        LongestGameMS: { $max: { $subtract: ["$endTime", "$startTime"] } },        
        ShortestGameMS: { $min: { $subtract: ["$endTime", "$startTime"] } },
        LongestGameOnOffenseMS: { $max: { $cond: { if: { $eq: ["$roster.position", "offense"] }, then: { $subtract: ["$endTime", "$startTime"] }, else: 0 } } },
        LongestGameOnDefenseMS: { $max: { $cond: { if: { $eq: ["$roster.position", "defense"] }, then: { $subtract: ["$endTime", "$startTime"] }, else: 0 } } },
        ShortestGameOnOffenseMS: { $min: { $cond: { if: { $eq: ["$roster.position", "offense"] }, then: { $subtract: ["$endTime", "$startTime"] }, else: null } } },
        ShortestGameOnDefenseMS: { $min: { $cond: { if: { $eq: ["$roster.position", "defense"] }, then: { $subtract: ["$endTime", "$startTime"] }, else: null } } },
        LongestGameAfterWinOnOffenseMS: { $max: { $cond: { if: 
            { "$and": [
                 { $eq: ["$roster.position", "offense"] }
                ,{ $eq: ["$roster.team", "$winningTeam"] }
            ]}
            , then: { $subtract: ["$endTime", "$startTime"] }, else: 0 } }
        },
        LongestGameAfterLossOnOffenseMS: { $max: { $cond: { if: 
            { "$and": [
                 { $eq: ["$roster.position", "offense"] }
                ,{ $ne: ["$roster.team", "$winningTeam"] }
            ]}
            , then: { $subtract: ["$endTime", "$startTime"] }, else: 0 } }
        },
        LongestGameAfterWinOnDefenseMS: { $max: { $cond: { if: 
            { "$and": [
                 { $eq: ["$roster.position", "defense"] }
                ,{ $eq: ["$roster.team", "$winningTeam"] }
            ]}
            , then: { $subtract: ["$endTime", "$startTime"] }, else: 0 } }
        },
        LongestGameAfterLossOnDefenseMS: { $max: { $cond: { if: 
            { "$and": [
                 { $eq: ["$roster.position", "defense"] }
                ,{ $ne: ["$roster.team", "$winningTeam"] }
            ]}
            , then: { $subtract: ["$endTime", "$startTime"] }, else: 0 } }
        },
        ShortestGameAfterWinOnOffenseMS: { $min: { $cond: { if: 
            { "$and": [
                 { $eq: ["$roster.position", "offense"] }
                ,{ $eq: ["$roster.team", "$winningTeam"] }
            ]}
            , then: { $subtract: ["$endTime", "$startTime"] }, else: null } }
        },
        ShortestGameAfterLossOnOffenseMS: { $min: { $cond: { if: 
            { "$and": [
                 { $eq: ["$roster.position", "offense"] }
                ,{ $ne: ["$roster.team", "$winningTeam"] }
            ]}
            , then: { $subtract: ["$endTime", "$startTime"] }, else: null } }
        },
        ShortestGameAfterWinOnDefenseMS: { $min: { $cond: { if: 
            { "$and": [
                 { $eq: ["$roster.position", "defense"] }
                ,{ $eq: ["$roster.team", "$winningTeam"] }
            ]}
            , then: { $subtract: ["$endTime", "$startTime"] }, else: null } }
        },
        ShortestGameAfterLossOnDefenseMS: { $min: { $cond: { if: 
            { "$and": [
                 { $eq: ["$roster.position", "defense"] }
                ,{ $ne: ["$roster.team", "$winningTeam"] }
            ]}
            , then: { $subtract: ["$endTime", "$startTime"] }, else: null } }
        }, 
        TotalOffensiveGameTimeMS: { $sum: { $cond: { if: { $eq: ["$roster.position", "offense"] }, then: { $subtract: ["$endTime", "$startTime"] }, else: 0 } } },
        TotalOffensiveGameTimeAfterLossMS: { $sum: { $cond: { if: 
            { "$and": [
                 { $eq: ["$roster.position", "offense"] }
                ,{ $ne: ["$roster.team", "$winningTeam"] }
            ]}
            , then: { $subtract: ["$endTime", "$startTime"] }, else: 0 } }
        },
        TotalOffensiveGameTimeAfterWinMS: { $sum: { $cond: { if: 
            { "$and": [
                 { $eq: ["$roster.position", "offense"] }
                ,{ $eq: ["$roster.team", "$winningTeam"] }
            ]}
            , then: { $subtract: ["$endTime", "$startTime"] }, else: 0 } }
        },
        TotalDefensiveGameTimeMS: { $sum: { $cond: { if: { $eq: ["$roster.position", "defense"] }, then: { $subtract: ["$endTime", "$startTime"] }, else: 0 } } },        TotalDefensiveGameTimeAfterLossMS: { $sum: { $cond: { if: 
            { "$and": [
                 { $eq: ["$roster.position", "defense"] }
                ,{ $ne: ["$roster.team", "$winningTeam"] }
            ]}
            , then: { $subtract: ["$endTime", "$startTime"] }, else: 0 } } 
        },
        TotalDefensiveGameTimeAfterWinMS: { $sum: { $cond: { if: 
            { "$and": [
                 { $eq: ["$roster.position", "defense"] }
                ,{ $eq: ["$roster.team", "$winningTeam"] }
            ]}
            , then: { $subtract: ["$endTime", "$startTime"] }, else: 0 } } 
        },        
        TotalOffensiveGames: { $sum: { $cond: { if: 
            { "$and": [
                { $ne: ["$roster.player_id", "$scores.player_id"] }
                ,{ $eq: ["$roster.position", "offense"] }
                ,{ $ne: ["$roster.team", "scores.team"] }
            ]}
            , then: 1, else: 0 } } 
        },
        TotalDefensiveGames: { $sum: { $cond: { if: 
            { "$and": [
                { $ne: ["$roster.player_id", "$scores.player_id"] }
                ,{ $eq: ["$roster.position", "defense"] }
                ,{ $ne: ["$roster.team", "scores.team"] }
            ]}
            , then: 1, else: 0 } } 
        },
        } 
     }
    ,{ $project: {
        Player: "$roster.player_id",
        TotalGamesPlayed: "$TotalGames",
        TotalGamesWon: "$TotalGamesWon",
        TotalGamesWonOnOffense: "$TotalGamesWonOnOffense",
        TotalGamesWonOnDefense: "$TotalGamesWonOnDefense",
        TotalGamesLostOnOffense: "$TotalGamesLostOnOffense",
        TotalGamesLostOnDefense: "$TotalGamesLostOnDefense",
        TotalGamesLost: "$TotalGamesLost",
        TotalGameTimeMS: "$TotalGameTimeMS",
        LongestGameMS: "$LongestGameMS",
        ShortestGameMS: "$ShortestGameMS",
        LongestGameOnOffenseMS: "$LongestGameOnOffenseMS",
        LongestGameOnDefenseMS: "$LongestGameOnDefenseMS",
        ShortestGameOnOffenseMS: "$ShortestGameOnOffenseMS",
        ShortestGameOnDefenseMS: "$ShortestGameOnDefenseMS",
        LongestGameAfterWinOnOffenseMS: "$LongestGameAfterWinOnOffenseMS",
        LongestGameAfterLossOnOffenseMS: "$LongestGameAfterLossOnOffenseMS",
        LongestGameAfterWinOnDefenseMS: "$LongestGameAfterWinOnDefenseMS",
        LongestGameAfterLossOnDefenseMS: "$LongestGameAfterLossOnDefenseMS",
        ShortestGameAfterWinOnOffenseMS: "$ShortestGameAfterWinOnOffenseMS",
        ShortestGameAfterLossOnOffenseMS: "$ShortestGameAfterLossOnOffenseMS",
        ShortestGameAfterWinOnDefenseMS: "$ShortestGameAfterWinOnDefenseMS",
        ShortestGameAfterLossOnDefenseMS: "$ShortestGameAfterLossOnDefenseMS",
        TotalOffensiveGameTimeMS: "$TotalOffensiveGameTimeMS",
        TotalDefensiveGameTimeMS: "$TotalDefensiveGameTimeMS",
        TotalOffensiveGameTimeAfterLossMS: "$TotalOffensiveGameTimeAfterLossMS",
        TotalOffensiveGameTimeAfterWinMS: "$TotalOffensiveGameTimeAfterWinMS",
        TotalDefensiveGameTimeAfterLossMS: "$TotalDefensiveGameTimeAfterLossMS",
        TotalDefensiveGameTimeAfterWinMS: "$TotalDefensiveGameTimeAfterWinMS",
        TotalGamesOnOffense: "$TotalOffensiveGames",
        TotalGamesOnDefense: "$TotalDefensiveGames",
        WinningPercentage: { $divide: ["$TotalGamesWon", "$TotalGames" ]  }
        }
    }
])       
    
var AllGames = db.games.count()

// Set the ms, sc, mn, hr, dy, wk to false if you
// don't want them in the output    
function getDuration(timeMillis, ms, sc, mn, hr, dy, wk){
    
    ms = typeof ms !== 'undefined' ? ms : true;
    sc = typeof sc !== 'undefined' ? sc : true;
    mn = typeof mn !== 'undefined' ? mn : true;
    hr = typeof hr !== 'undefined' ? hr : true;
    dy = typeof dy !== 'undefined' ? dy : true;
    wk = typeof wk !== 'undefined' ? wk : true;
    
    
    var units = [
        {label:"millis",    mod:1000,},
        {label:"seconds",   mod:60,},
        {label:"minutes",   mod:60,},
        {label:"hours",     mod:24,},
        {label:"days",      mod:7,},
        {label:"weeks",     mod:52,},
    ];
    var duration = new Object();
    var x = timeMillis;
    for (i = 0; i < units.length; i++){
        var tmp = x % units[i].mod;
        duration[units[i].label] = tmp;
        x = (x - tmp) / units[i].mod
    }

    var str = "";
    str += wk === true ? duration.weeks + " weeks " : "";
    str += dy === true ? duration.days + " days " : "";
    str += hr === true ? duration.hours + " hours " : "";
    str += mn === true ? duration.minutes + " mins " : "";
    str += sc === true ? duration.seconds + " secs " : "";
    str += ms === true ? duration.millis + " millis" : "";
    return str;
}    
    
PlayerGames.result.forEach(function(item) {
  
    var playerPointData = PlayerPoints.result.filter(function(entry) {
        return (entry._id == item._id)
    });
    
    // Total Games
    item.AllGames = AllGames;
    
    // Total Points
    item.TotalOffensivePoints = playerPointData[0].TotalPointsOnOffense;
    item.TotalDefensivePoints = playerPointData[0].TotalPointsOnDefense;
    item.TotalPoints = item.TotalOffensivePoints + item.TotalDefensivePoints;

    // Average Points
    item.AveragePointsPerGame          = item.TotalPoints          / item.TotalGamesPlayed;
    item.AverageOffensivePointsPerGame = item.TotalOffensivePoints / item.TotalGamesPlayed;
    item.AverageDefensivePointsPerGame = item.TotalDefensivePoints / item.TotalGamesPlayed;
    
    // Total Time Stats
    item.TotalGameTime = getDuration(item.TotalGameTimeMS, false);
    item.TotalOffensiveGameTime = getDuration(item.TotalOffensiveGameTimeMS, false);
    item.TotalDefensiveGameTime = getDuration(item.TotalDefensiveGameTimeMS, false);
    
    // Average Time Stats
    item.AverageGameTime = getDuration(item.TotalGameTimeMS / item.TotalGamesPlayed, false, true, true, false, false, false);
    item.AverageOffensiveGameTime = getDuration(item.TotalOffensiveGameTimeMS / item.TotalGamesOnOffense, false, true, true, false, false, false);
    item.AverageDefensiveGameTime = getDuration(item.TotalDefensiveGameTimeMS / item.TotalGamesOnDefense, false, true, true, false, false, false);
    item.AverageOffensiveGameTimeAfterLoss = getDuration(item.TotalOffensiveGameTimeAfterLossMS / item.TotalGamesLostOnOffense, false, true, true, false, false, false);
    item.AverageOffensiveGameTimeAfterWin = getDuration(item.TotalOffensiveGameTimeAfterWinMS / item.TotalGamesWonOnOffense, false, true, true, false, false, false);
    item.AverageDefensiveGameTimeAfterLoss = getDuration(item.TotalDefensiveGameTimeAfterLossMS / item.TotalGamesLostOnDefense, false, true, true, false, false, false);
    item.AverageDefensiveGameTimeAfterWin = getDuration(item.TotalDefensiveGameTimeAfterWinMS / item.TotalGamesWonOnDefense, false, true, true, false, false, false);

   // Longest and Shortest Game Time Stats
   item.LongestGame = getDuration(item.LongestGameMS, false, true, true, false, false, false);
   item.ShortestGame = getDuration(item.ShortestGameMS, false, true, true, false, false, false);
   item.LongestGameOnOffense = getDuration(item.LongestGameOnOffenseMS, false, true, true, false, false, false);
   item.LongestGameOnDefense = getDuration(item.LongestGameOnDefenseMS, false, true, true, false, false, false);
   item.ShortestGameOnOffense = getDuration(item.ShortestGameOnOffenseMS, false, true, true, false, false, false);
   item.ShortestGameOnDefense = getDuration(item.ShortestGameOnDefenseMS, false, true, true, false, false, false);
   
   // Longest Game Time Stats
   item.LongestGameAfterWinOnOffense = getDuration(item.LongestGameAfterWinOnOffenseMS, false, true, true, false, false, false);
   item.LongestGameAfterLossOnOffense = getDuration(item.LongestGameAfterLossOnOffenseMS, false, true, true, false, false, false);
   item.LongestGameAfterWinOnDefense = getDuration(item.LongestGameAfterWinOnDefenseMS, false, true, true, false, false, false);
   item.LongestGameAfterLossOnDefense = getDuration(item.LongestGameAfterLossOnDefenseMS, false, true, true, false, false, false);
   
   // Shortest Game Time Stats
   item.ShortestGameAfterWinOnOffense = getDuration(item.ShortestGameAfterWinOnOffenseMS, false, true, true, false, false, false);
   item.ShortestGameAfterLossOnOffense = getDuration(item.ShortestGameAfterLossOnOffenseMS, false, true, true, false, false, false);
   item.ShortestGameAfterWinOnDefense = getDuration(item.ShortestGameAfterWinOnDefenseMS, false, true, true, false, false, false);
   item.ShortestGameAfterLossOnDefense = getDuration(item.ShortestGameAfterLossOnDefenseMS, false, true, true, false, false, false);
   
});

//sort it
var sorted = PlayerGames.result.sort(function(a, b) {
        return (b.AveragePointsPerGame > a.AveragePointsPerGame) ? 1 : ((b.AveragePointsPerGame < a.AveragePointsPerGame) ? -1 : 0);
    });

PlayerGames