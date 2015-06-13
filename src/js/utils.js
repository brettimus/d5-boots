var d3 = require("d3");

var format = d3.time.format("%Y-%m-%d"); // yyyy-mm-dd

// generate n random 
function randomTimeSeriesData(n, start) {
    n = n || 50;
    var i,
        datum,
        rNumber = 0,
        date = start || new Date(2010, 0, 1),
        result = [];

    for (i = 0; i < n; i++) {
        // add ranodmly generated data to the result
        datum = [format(date), rNumber];
        result.push(datum);

        // increment month, set a new random number
        date.setMonth(date.getMonth() + 1);
        rNumber = Math.floor(Math.random()*100);
    }

    return result;
}

function parentWidth(d3Sel) {
    return d3Sel.node().parentNode.getBoundingClientRect().width;
}

function round(n, k) {
    // k is number of decimal places
    var factor = Math.pow(10, k);
    return Math.round(factor * n) / factor;
}

function toPercent(a, b) {
    if (arguments.length === 1) {
        return Math.round(a) + "%";
    }
    return toPercent(100*a/b);
}


module.exports = {
    timeSeriesData: randomTimeSeriesData,
    parentWidth: parentWidth,
    round: round,
    toPercent: toPercent,
};

