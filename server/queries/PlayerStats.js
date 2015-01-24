var Game = require('../models/Game');

var PlayerStats = function () {

    var queries = {
        gamesQuery: [
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
        ]
        ,playersQuery: [
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
        ]
    };

    var matchPlayer = function (playerId, queryName) {
        queries[queryName].splice(1, 0, { $match: { "roster.player_id" : playerId } });
    };

    var getGamesQuery = function (playerId) {
        if (playerId != null && playerId != "") {
            matchPlayer(playerId, "gamesQuery")
        }
        return Game.aggregate(queries.gamesQuery);
    };

    var getPlayersQuery = function (playerId) {
        if (playerId != null && playerId != "") {
            matchPlayer(playerId, "playersQuery")
        }
        return Game.aggregate(queries.playersQuery);
    };

    // Set the ms, sc, mn, hr, dy, wk to false if you
    // don't want them in the output
    var getDuration = function (timeMillis, ms, sc, mn, hr, dy, wk){
        ms = typeof ms !== 'undefined' ? ms : true;
        sc = typeof sc !== 'undefined' ? sc : true;
        mn = typeof mn !== 'undefined' ? mn : true;
        hr = typeof hr !== 'undefined' ? hr : true;
        dy = typeof dy !== 'undefined' ? dy : true;
        wk = typeof wk !== 'undefined' ? wk : true;

        var units = [
            {label:"millis",    mod:1000},
            {label:"seconds",   mod:60},
            {label:"minutes",   mod:60},
            {label:"hours",     mod:24},
            {label:"days",      mod:7},
            {label:"weeks",     mod:52}
        ];

        var duration = {};
        var x = timeMillis;
        for (var i = 0; i < units.length; i++){
            var tmp = x % units[i].mod;
            duration[units[i].label] = tmp;
            x = (x - tmp) / units[i].mod;
        }

        var str = "";
        str += wk === true ? duration.weeks + " weeks " : "";
        str += dy === true ? duration.days + " days " : "";
        str += hr === true ? duration.hours + " hours " : "";
        str += mn === true ? duration.minutes + " mins " : "";
        str += sc === true ? duration.seconds + " secs " : "";
        str += ms === true ? duration.millis + " millis" : "";
        return str;
    };

    var getPlayerResults = function (player, playerPointData, gamesCount) {

        player.AllGames = gamesCount;
        player.TotalOffensivePoints = playerPointData.TotalPointsOnOffense;
        player.TotalDefensivePoints = playerPointData.TotalPointsOnDefense;
        player.TotalPoints = player.TotalOffensivePoints + player.TotalDefensivePoints;

        player.AverageOffensivePointsPerGame = player.TotalOffensivePoints / player.TotalGamesPlayed;
        player.AverageDefensivePointsPerGame = player.TotalDefensivePoints / player.TotalGamesPlayed;
        player.AveragePointsPerGame          = player.TotalPoints          / player.TotalGamesPlayed;

        player.TotalGameTime = getDuration(player.TotalGameTimeMS, false);
        player.TotalOffensiveGameTime = getDuration(player.TotalOffensiveGameTimeMS, false);
        player.TotalDefensiveGameTime = getDuration(player.TotalDefensiveGameTimeMS, false);
        player.AverageGameTime = getDuration(player.TotalGameTimeMS / player.TotalGamesPlayed, false, true, true, false, false, false);
        player.AverageOffensiveGameTime = getDuration(player.TotalOffensiveGameTimeMS / player.TotalGamesOnOffense, false, true, true, false, false, false);
        player.AverageDefensiveGameTime = getDuration(player.TotalDefensiveGameTimeMS / player.TotalGamesOnDefense, false, true, true, false, false, false);
        player.AverageOffensiveGameTimeAfterLoss = getDuration(player.TotalOffensiveGameTimeAfterLossMS / player.TotalGamesLostOnOffense, false, true, true, false, false, false);
        player.AverageOffensiveGameTimeAfterWin = getDuration(player.TotalOffensiveGameTimeAfterWinMS / player.TotalGamesWonOnOffense, false, true, true, false, false, false);
        player.AverageDefensiveGameTimeAfterLoss = getDuration(player.TotalDefensiveGameTimeAfterLossMS / player.TotalGamesLostOnDefense, false, true, true, false, false, false);
        player.AverageDefensiveGameTimeAfterWin = getDuration(player.TotalDefensiveGameTimeAfterWinMS / player.TotalGamesWonOnDefense, false, true, true, false, false, false);

        return player;
    };

    var processResults = function (gamesResults, playersResults, gameCount) {
        var playerResults = [];

        gamesResults.forEach(function(player) {
            var playerPointData = playersResults.filter(function(entry) {
                return (entry._id == player._id)
            });

            var playerResult = getPlayerResults(player, playerPointData[0], gameCount);

            playerResults.push(playerResult);
        });

        return playerResults.sort(function(a, b) {
                return (b.AveragePointsPerGame > a.AveragePointsPerGame) ? 1 : ((b.AveragePointsPerGame < a.AveragePointsPerGame) ? -1 : 0);
        });
    };

    return {
        getGamesQuery: getGamesQuery,
        getPlayersQuery: getPlayersQuery,
        processResults: processResults
    }
};

module.exports = PlayerStats;