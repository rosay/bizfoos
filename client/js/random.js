// todo: treat this as a service, talk to Cody
var random = {
    // https://www.random.org/integers/?num=1&min=1&max=100000&col=1&base=10&format=plain&rnd=new
     seed: -1
    ,seeding: false
    ,itemsAlreadyUsed : []
    ,maxUniqueRetryAttempts : 0
    ,reseed: function() {
        if (random.seeding) return;
        random.seeding = true;
        $.get("https://www.random.org/integers/", {num: "1", col: "1", min: "1", max: "1000000000", base: "10", format: "plain", rnd: "new"}, function(randNum) {
              random.seed = randNum;
			  random.seeding = false;
              console.log("random.seed", random.seed);
        });
    }
    ,init: function() {
    	random.reseed();
    }
    ,rnd : function() {
        var r;
        if (this.seed == -1) { // not seeded yet (no return from random.org)
            random.reseed();
            r = Math.random();
        } else {
            var r = Math.sin(this.seed++) * 10000;
            r = r - Math.floor(r);
        }
        //console.log("rnd():", this.seed, r);
        return r;
    }
    ,reset: function () {
         this.itemsAlreadyUsed = [];
        this.maxUniqueRetryAttempts = 0;
    }
    ,chance: function(oddsOfBeingTrue) {
        // return true or false. chance(.333) returns true 33.3% of the time
        return (random.rnd() <= oddsOfBeingTrue); 
    }
    ,getFromRange: function(min, max) {
        return (random.rnd() * (min - max) + max);
    }
    ,getIntFromRange: function(min, max) {
        return Math.floor(random.rnd() * (max - min + 1)) + min;
    }
    ,getItem: function(aData, bMustBeUnique) {
    	if (bMustBeUnique == undefined) bMustBeUnique = true;
    	//console.log("bMustBeUnique", bMustBeUnique)
        var returnThis = aData[ random.getIntFromRange(0, aData.length-1) ];
        var indexAlreadyUsed = this.itemsAlreadyUsed.indexOf(returnThis);
        if (!bMustBeUnique) {
            if (indexAlreadyUsed >= 0) this.itemsAlreadyUsed.push(returnThis);
            return returnThis;
        } else {
	        Debug("already used it?  "+ indexAlreadyUsed +" ... retries: "+ this.maxUniqueRetryAttempts);
	        //console.log("indexAlreadyUsed >= 0", indexAlreadyUsed >= 0);
	        //console.log("this.maxUniqueRetryAttempts < 5", this.maxUniqueRetryAttempts < 5);
	        //console.log("(!returnThis.notRandom)", (!returnThis.notRandom));
	        //console.log((indexAlreadyUsed >= 0 && this.maxUniqueRetryAttempts < 5 && (!returnThis.notRandom)));
	        
	        if (indexAlreadyUsed >= 0 && this.maxUniqueRetryAttempts < 5 && (!returnThis.notRandom)) {
	            Debug("already used it, try again...")
	            Debug(returnThis);
	            // call it again
	            this.maxUniqueRetryAttempts++;
	            return this.getItem(aData);
	        } else {
	            this.maxUniqueRetryAttempts = 0;
	            this.itemsAlreadyUsed.push(returnThis);
	            return returnThis;
	        }
	    }
    }
}