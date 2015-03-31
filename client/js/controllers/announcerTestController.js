app.controller('AnnouncerTestController', ['announcerService', function(announcerService) {
    "use strict";

    var vm = this;

    vm.log = [];

    var gameSettings = {
        "pointsNeededToWin": 5,
        "debug": true,
        //"skipIntro": true,

        "roster": {
            "teamBlack": {
                "offense": {
                    "_id": "ahovingh@bizstream.com",
                    "name": "Albert Hovingh",
                    "nicknames": "Bert, Al, The Trash Man",
                    "pic": ""
                },
                "defense": {
                    "_id": "areece@bizstream.com",
                    "name": "Adam Reece",
                    "pic": ""
                }
            },
            "teamYellow": {
                "offense": {
                    "_id": "mschmidt@bizstream.com",
                    "name": "Mark Schmidt",
                    "firstName": "Mark",
                    "lastName": "Schmidt",
                    "nicknames": "Schmidty",
                    "pic": ""
                },
                "defense": {
                    "_id": "sheibeck@bizstream.com",
                    "name": "Sterling Heibeck",
                    "nicknames": "The Ninja",
                    "pic": ""
                }
            }
        }
        ,teamNames: [{
            name: "The Avengers",
            players: ["sheibeck@bizstream.com", "mschmidt@bizstream.com"]
        },{
            name: "The Dream Team",
            players: ["areece@bizstream.com", "ahovingh@bizstream.com"]
        }]

        /*
         "teams" : [
         {
         "color": "black",
         "team": "The Dream Team"
         //"probabilty": .80
         },
         {
         "color": "yellow",
         "team": "The Avengers"
         //"probabilty": .20
         }
         ],
         "players" : [
         {	//0
         "playerid": "ahovingh@bizstream.com",
         "color": "black",
         "position": "o",
         "team": "The Dream Team",
         "names": [
         "Albert",
         "Bert",
         "Hovingh",
         "The Trash man"
         ]
         },
         {	//1
         "playerid": "areece@bizstream.com",
         "color": "black",
         "position": "d",
         "team": "The Dream Team",
         "names": [
         "Adam",
         "Reece"
         ]
         },
         {	//2
         "playerid": "mschmidt@bizstream.com",
         "color": "yellow",
         "position": "o",
         "team": "The Avengers",
         "names": [
         "Mark",
         "Schmidt",
         "Schmidty"
         ]
         },
         {	//3
         "playerid": "sheibeck@bizstream.com",
         "color": "yellow",
         "position": "d",
         "team": "The Avengers",
         "names": [
         "Sterling",
         "Heibeck",
         //"The Sterl",
         "The Ninja"
         ]
         }
         ] // end array of peole
         */
    };

    var gameSpeedSimulator = 1;// 5 times faster

    var gameSeconds = 0;
    var tmrGameClock = null;

    var $gameClock = $("#timeClock");

    var addToLog = function(msg) {
        var d = new Date();
        vm.log.push(d.toLocaleTimeString() +": "+ $gameClock.text() +": "+ msg);
    };

    vm.doVoiceTest = function () {
        announcerService.voiceTest();
    };

    vm.doMusicTest = function () {
        announcerService.musicTest();
    };

    vm.doRandomTest = function () {
        addToLog(announcerService.randomTest());
    };

    vm.doStringTest = function () {
        addToLog(announcerService.stringTest(gameSettings));
    };

    vm.stopGame = function () {
        announcerService.stop();
    };

    vm.newGame = function () {
        gameSeconds = 0;
        addToLog("New Game Started");
        announcerService.init(gameSettings); // end config, end initalize of SmartAnnouncer

        // start game clock
        clearInterval(tmrGameClock);
        tmrGameClock = setInterval(updateGameClock, 1000); // every second
    };


    var updateGameClock = function() {
        gameSeconds += (gameSpeedSimulator);
        var min = Math.floor(gameSeconds/60);
        var sec = gameSeconds - (min*60);
        if (sec < 10) sec = "0"+ sec;
        $gameClock.text(min+ ":"+ sec);
    };

    vm.playerScore = function (player) {
        var oMessage = announcerService.scorePoint({
            "playerid": player.id,
            //"color": $this.attr("data-color"),
            //"position": $this.attr("data-position"),
            "power":  -42/* should be a number 0-9. -42 == random */
        });

        addToLog(oMessage.message);
    };


}]);