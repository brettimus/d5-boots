var d3 = require("d3"),
    parentWidth = require("../utils").parentWidth,
    moment = require("moment"),
    extend = require("boots-utils").extend,
    errors = require("../errors");

module.exports = bline;

var DEFAULTS = {
    height : 500,
    width  : 960,
    marginTop: 20,
    marginRight: 20,
    marginBottom: 50,
    marginLeft: 20,
    xValue: errors.xValueError,
    yValue: errors.yValueError,
    interpolate: "basis",
    stroke: "#222",
};

function bline(options) {
    options = extend(DEFAULTS, options);


    var width = options.width - options.marginLeft - options.marginRight,
        height = options.height - options.marginTop - options.marginBottom,
        // margin      = options.margin,
        marginTop = options.marginTop,
        marginRight = options.marginRight,
        marginBottom = options.marginBottom,
        marginLeft = options.marginLeft,
        xScale      = d3.time.scale(),
        yScale      = d3.scale.linear(),
        xAxis       = d3.svg.axis().scale(xScale).orient("bottom").ticks(d3.time.months, 1).tickFormat(d3.time.format("%b '%y")),
        yAxis       = d3.svg.axis().scale(yScale).orient("left"),
        interpolate = options.interpolate,
        line        = d3.svg.line().x(X).y(Y),
        parseDate = d3.time.format("%y-%m-%d").parse;

    var chart = function chart(selection) {
        selection.each(function(data) {

            xScale
                .domain(d3.extent(data, options.xValue))
                .range([0, width - marginLeft - marginRight]);

            // Update the y-scale.
            yScale
                .domain([0, d3.max(data, options.yValue)])
                .range([height - marginTop - marginBottom, 0]);

            xAxis.scale(xScale);
            yAxis.scale(yScale);

            line.interpolate(interpolate);

            var svg = d3.select(this).selectAll("svg").data([data]);

            var gEnter = svg.enter().append("svg").append("g");
            gEnter.append("path").attr("class", "line");
            gEnter.append("g").attr("class", "x axis");
            gEnter.append("g").attr("class", "y axis");

            // Update the outer dimensions.
            svg.attr("width", width)
                .attr("height", height);

            // Update the inner dimensions.
            var g = svg.select("g")
                .attr("transform", "translate(" + [marginLeft, marginTop] + ")");

            // Update the line path.
            g.select(".line")
                // .transition()
                .attr("d", line)
                .style("stroke", options.stroke);

            // Update the x-axis.
            g.select(".x.axis")
                .attr("transform", "translate(0," + yScale.range()[0] + ")")
                .call(xAxis)
                .selectAll("text")
                    .style("text-anchor", "end")
                    .attr("dx", "-.8em")
                    .attr("dy", ".15em")
                    .attr("transform", function(d) {
                        return "rotate(-65)";
                    });

            g.select(".y.axis")
                .attr("class", "y axis")
                .call(yAxis);
        });
    };

    // accessor functions for attributes we want to be able to update
    chart.height = function(value) {
        if (!arguments.length) return height;
        height = value;
        return chart;
    };

    chart.width = function(value) {
        if (!arguments.length) return width;
        width = value;
        return chart;
    };

    chart.margin = function(value) {
        if (!arguments.length) return margin;
        margin = value;
        return chart;
    };

    chart.interpolate = function(value) {
        if (!arguments.length) return interpolate;
        interpolate = value;
        return chart;
    };

    chart.y = function(color) {
        if (!arguments.length) return options.stroke;
        options.stroke = color;
        return chart;
    };

    chart.x = function(getter) {
        if (!arguments.length) return x;
        options.xValue = getter;
        return chart;
    };

    chart.y = function(getter) {
        if (!arguments.length) return y;
        options.yValue = getter;
        return chart;
    };

    // accessors for the SVG path generator
    function X(d) {
        return xScale(options.xValue(d));
    }

    function Y(d) {
        return yScale(options.yValue(d));
    }

    return chart;
}

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


