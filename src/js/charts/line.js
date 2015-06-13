var d3 = require("d3"),
    parentWidth = require("../utils").parentWidth,
    moment = require("moment"),
    extend = require("boots-utils").extend;

module.exports = aline;


function aline(selection, options, data) {
    data = data || fakeData();

    var defaults = {
        lineColor: "",
        height: 280,
        width: parentWidth(selection),
        marginTop: 20,
        marginRight: 20,
        marginBottom: 50,
        marginLeft: 20,
    };

    options = extend({}, defaults, options);

    data.forEach(function(d) {
        d.date = new Date(d.date);
    });

    console.log("line data", data);
    var width = options.width - options.marginLeft - options.marginRight,
        height = options.height - options.marginTop - options.marginBottom;

    var parseDate = d3.time.format("%y-%m-%d").parse;

    var x = d3.time.scale()
        .range([0, width]);

    var y = d3.scale.linear()
        .range([height, 0]);

    var xAxis = d3.svg.axis()
        .scale(x)
        .orient("bottom")
        .ticks(d3.time.months, 1)
        .tickFormat(d3.time.format("%b '%y"));

    var yAxis = d3.svg.axis()
        .scale(y)
        .orient("left");

    var line = d3.svg.line()
        .interpolate("basis")
        .x(function(d) { return x(d.date); })
        .y(function(d) { return y(d.count); });

    var svg = selection
        .attr("width", options.width)
        .attr("height", options.height)
      .append("g")
        .attr("transform", "translate(" + [options.marginLeft, options.marginTop] + ")");

    x.domain(d3.extent(data, function(d) { return d.date; }));
    y.domain(d3.extent(data, function(d) { return d.count; }));

    svg.append("g")
        .attr("class", "x axis")
        .attr("transform", "translate(0," + height + ")")
        .call(xAxis)
        .selectAll("text")
            .style("text-anchor", "end")
            .attr("dx", "-.8em")
            .attr("dy", ".15em")
            .attr("transform", function(d) {
                return "rotate(-65)";
            });

    svg.append("g")
        .attr("class", "y axis")
        .call(yAxis)
      .append("text")
        .attr("transform", "translate(40,-10)")
        .attr("y", 6)
        .attr("dy", ".71em")
        .style("text-anchor", "end")
        .text("Users");

    svg.append("path")
        .datum(data)
        .attr("class", "line")
        .attr("d", line);
}


function fakeData() {
    var result = [];

    var to = new Date(),
        from = new Date(to);

        from.setYear((1900+from.getYear())-1);

        while (from <= to) {
            result.push({
                date: moment(from).format(),
                count: Math.floor(Math.random()*56 + 12)
            });
            from.setMonth(from.getMonth() + 1);
        }
    return result;
}


