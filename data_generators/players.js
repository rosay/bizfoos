/**
 * Created by cody on 11/16/14.
 */
// Run from shell: mongo localhost:27017/bizfoosDevDb data_generators/players.js

// Clear out current players
db.players.remove({});

// Load with defaults
db.players.insert({ name : "Marky Mark" });
db.players.insert({ name : "Mcbeev" });
db.players.insert({ name : "Batman" });
db.players.insert({ name : "CVB" });
db.players.insert({ name : "Adam" });
db.players.insert({ name : "Al" });
db.players.insert({ name : "Dustin " });
db.players.insert({ name : "Kevin" });
db.players.insert({ name : "Blair" });
db.players.insert({ name : "Dan" });
db.players.insert({ name : "Cody" });
