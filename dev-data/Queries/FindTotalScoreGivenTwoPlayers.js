var game_id = db.games.find().skip(2).limit(1).toArray()[0]._id;
var team1Offense = db.games.find({ _id: game_id }).toArray()[0].roster[0].player_id;
var team1Defense = db.games.find({ _id: game_id }).toArray()[0].roster[1].player_id;
var taem2Offense = db.games.find({ _id: game_id }).toArray()[0].roster[2].player_id;
var team2Defense = db.games.find({ _id: game_id }).toArray()[0].roster[3].player_id;

db.games.aggregate([
         { $match: { _id: game_id }}
        ,{ $unwind: "$scores" }
        ,{ $match: { $or: [{ 'scores.player_id': team1Offense }, {'scores.player_id': team1Defense }] }}
        ,{ $group : { _id : 'Team 1', ScoreCount : { $sum : 1 }}}
]);

db.games.aggregate([

         { $match: { _id: game_id }}
        ,{ $unwind: "$scores" }
        ,{ $match: { $or: [{ 'scores.player_id': taem2Offense }, {'scores.player_id': team2Defense }] }}
        ,{ $group : { _id : 'Team 2', ScoreCount : { $sum : 1 }}}

]);
