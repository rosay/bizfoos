db.games.aggregate([
     { $unwind: "$roster" }
//    ,{ $match: { endTime: { "$gt": new Date(new Date().getTime() - 7*24*60*60*1000) }} }
    ,{ $match: { "roster.player_id": "sterling@bizstream.com" } }
    ,{ $project: {
        _id:0,
        //playerTeam: "$roster.team",
        //winningTeam: "$winningTeam",
        WinningTeam: { $eq: ["$roster.team", "$winningTeam"] }
     }}
    ,{ $match: { WinningTeam: true } }
    ,{ $group: { _id: "Wins", count: { $sum: 1 } } }
])
