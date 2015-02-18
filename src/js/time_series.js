var d3    = require("d3"),
    merge = require("merge");

// sensible errors
function xValueError() {
    var message = "I don't know how to access the data's x-values. "+
                    "Configure my getter with <sample code>.";
    throw new Error(message);
}

function yValueError() {
    var message = "I don't know how to access the data's y-values. "+
                    "Configure my getter with <sample code>.";
    throw new Error(message);
}

// sensible defaults for a line chart, right?
var DEFAULTS = {
    margin: {
        top    : 10,
        right  : 10,
        bottom : 25,
        left   : 25,
    },
    dimensions: {
        height : 500,
        width  : 960,
    },
    line: {
        interpolate: "linear",
    },
    xValue: xValueError,
    yValue: yValueError,
};

// heavily inspired by m. bostock's example of a reusable time-series chart
function timeSeriesLine(options) {
    // merge the defaults with our options
    options = merge.recursive(true, DEFAULTS, options || {});

    var height      = options.dimensions.height,
        width       = options.dimensions.width,
        margin      = options.margin,
        xScale      = d3.time.scale(),
        yScale      = d3.scale.linear(),
        xAxis       = d3.svg.axis().scale(xScale).orient("bottom").tickSize(6, 0),
        yAxis       = d3.svg.axis().scale(yScale).orient("left"),
        area        = d3.svg.area().x(X).y1(Y),
        line        = d3.svg.line().x(X).y(Y),
        interpolate = options.line.interpolate;

    var chart = function chart(selection) {
        selection.each(function(data) {
            // Generate the chart
            // * `this` is the DOM element
            // * `data` is the data

            // Update the x-scale.
            xScale
                .domain(d3.extent(data, options.xValue))
                .range([0, width - margin.left - margin.right]);

            // Update the y-scale.
            yScale
                .domain([0, d3.max(data, options.yValue)])
                .range([height - margin.top - margin.bottom, 0]);

            // Update the line's interpolation
            line.interpolate(interpolate);
            area.interpolate(interpolate);

            // Grab that svg element
            var svg = d3.select(this).selectAll("svg").data([data]);

            // If there isn't an svg element, we need to make one
            // *** NB - this is the beauty of the d3 update pattern...
            var gEnter = svg.enter().append("svg").append("g");
            gEnter.append("path").attr("class", "area");
            gEnter.append("path").attr("class", "line");
            gEnter.append("g").attr("class", "x axis");
            gEnter.append("g").attr("class", "y axis");

            // Update the outer dimensions.
            svg.attr("width", width)
                .attr("height", height);

            // Update the inner dimensions.
            var g = svg.select("g")
                .attr("transform", "translate(" + [margin.left, margin.top] + ")");

            // Update the area path.
            g.select(".area")
                // .attr("d", area.y0(yScale.range()[1]))
                // .transition()
                .attr("d", area.y0(yScale.range()[0]));
                // .duration(1000);

            // Update the line path.
            g.select(".line")
                // .transition()
                .attr("d", line);

            // Update the x-axis.
            g.select(".x.axis")
                .attr("transform", "translate(0," + yScale.range()[0] + ")")
                .call(xAxis);

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

module.exports = timeSeriesLine;