var Game = require('../models/Game');

var PlayerPointsById = function () {
    var query = [
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
            }
        }
        }
        ,{ $project: {
            Player: "$roster.player_id",
            TotalPointsOnOffense: "$TotalPointsOnOffense",
            TotalPointsOnDefense: "$TotalPointsOnDefense",
            TotalPointsAgainstOnDefense: "$TotalPointsAgainstOnDefense"
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

module.exports = PlayerPointsById;