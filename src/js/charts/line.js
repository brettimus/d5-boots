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
        line        = d3.svg.line().x(X).y(Y);

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


