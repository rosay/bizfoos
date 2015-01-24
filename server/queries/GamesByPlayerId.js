var Game = require('../models/Game');

var GamesByPlayerId = function () {
    var query = [
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
            }
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
    ];

    var matchPlayer = function (playerId) {
        query.splice(1, 0, { $match: { "roster.player_id" : playerId } });
    };

    var getQuery = function (playerId) {
        if (playerId != null && playerId != "") {
            matchPlayer(playerId)
        }

        return Game.aggregate(query);
    };

    return {
        getQuery: getQuery
    }
};

module.exports = GamesByPlayerId;

