// Set the ms, sc, mn, hr, dy, wk to false if you
// don't want them in the output
module.exports = function (timeMillis, ms, sc, mn, hr, dy, wk){
    ms = typeof ms !== 'undefined' ? ms : true;
    sc = typeof sc !== 'undefined' ? sc : true;
    mn = typeof mn !== 'undefined' ? mn : true;
    hr = typeof hr !== 'undefined' ? hr : true;
    dy = typeof dy !== 'undefined' ? dy : true;
    wk = typeof wk !== 'undefined' ? wk : true;

    var units = [
        {label:"millis",    mod:1000,},
        {label:"seconds",   mod:60,},
        {label:"minutes",   mod:60,},
        {label:"hours",     mod:24,},
        {label:"days",      mod:7,},
        {label:"weeks",     mod:52,},
    ];

    var duration = {};
    var x = timeMillis;
    for (i = 0; i < units.length; i++){
        var tmp = x % units[i].mod;
        duration[units[i].label] = tmp;
        x = (x - tmp) / units[i].mod
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