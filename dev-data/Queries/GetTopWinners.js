db.games.aggregate([
     { $unwind: "$roster" }
    ,{ $group: { 
        _id: "$roster.player_id" ,
        TotalGamesPlayed: { $sum: 1 },
        TotalGamesWon: { $sum: { $cond: { if: { $eq: ["$winningTeam", "$roster.team"] }, then: 1, else: 0 } } },
      } 
     }
    ,{ $project: {
        Player: "$roster.player_id",
        TotalGamesPlayed: "$TotalGamesPlayed",
        TotalGamesWon: "$TotalGamesWon",
        WinningPercentage: { $divide: ["$TotalGamesWon", "$TotalGamesPlayed" ]  } 
        }
    }
    ,{ $sort: {
        "WinningPercentage":-1, "TotalGamesPlayed":1
    }
    }
])
