// Get count of players win and loss counts for the last 7 days.
db.games.aggregate([
     { $unwind: "$roster" }
    ,{ $match: { endTime: { "$gt": new Date(new Date().getTime() - 7*24*60*60*1000) }} }
    ,{ $match: { "roster.player_id": "sterling@bizstream.com" } }
    ,{ $project: {
        _id:0,
        outcome: { $cond: { if: { $eq: ["$roster.team", "$winningTeam"] }, then: "win", else: "loss" } }
     }}
   ,{ $group: { _id: "$outcome", count: { $sum: 1 } } }
])
