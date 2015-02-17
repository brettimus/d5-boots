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

module.exports = {
    timeSeriesData: randomTimeSeriesData
};