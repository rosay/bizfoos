db.scores.find({ 
     player_Id: ObjectId("546ea25f602cb9ca83b290ff")
    ,ScoreTime: {"$gt": new Date(new Date().getTime() - 7*24*60*60*1000)} // 7 days ago
})