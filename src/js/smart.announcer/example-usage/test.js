jQuery(function($) {
	var smartAnnouncer;

	var gameSpeedSimulator = 5;// 5 times faster

	var gameSeconds = 0;
	var tmrGameClock = null;

	var $gameClock = $("#timeClock");

	var addToLog = function(msg) {
		var d = new Date()
		$("#log").append("<div>"+ d.toLocaleTimeString() +": "+ $gameClock.text() +": "+ msg +"</Div>");
	}

	$("#newGame").click(function() {
		gameSeconds = 0;
		addToLog("New Game Started");
		smartAnnouncer = new SmartAnnouncer({
			"pointsNeededToWin": 5,
			"debug": true,
			"teams" : [
				{
					"color": "black",
					"team": "The Dream Team"
				},
				{
					"color": "yellow",
					"team": "The Avengers"
				}
			],
			"players" : [
				{	//0
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
					"color": "black",
					"position": "d",
					"team": "The Dream Team",
					"names": [
						"Adam",
						"Reece"
					]
				},
				{	//2
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
		}); // end config, end initalize of SmartAnnouncer

		// start game clock
		clearInterval(tmrGameClock);
		tmrGameClock = setInterval(updateGameClock, 1000); // every second


	}); // end onclick event for new game


	var updateGameClock = function() {
		gameSeconds += (gameSpeedSimulator);
		min = Math.floor(gameSeconds/60);
		sec = gameSeconds - (min*60);
		if (sec < 10) sec = "0"+ sec;
		$gameClock.text(min+ ":"+ sec);
	} 


	$("button.player-score").click(function() {
		var $this = $(this);

		var oMessage = smartAnnouncer.ScorePoint({
			"color": $this.attr("data-color"),
			"position": $this.attr("data-position")
		})

		addToLog(oMessage.message);

	})


});