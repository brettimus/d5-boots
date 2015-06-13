var d3 = require("d3"),
    parentWidth = require("../utils").parentWidth,
    errors = require('../errors'),
    extend = require("boots-utils").extend;

module.exports = doonut;

var DEFAULTS = {
    height : 500,
    width  : 960,
    marginTop: 20,
    marginRight: 20,
    marginBottom: 50,
    marginLeft: 20,
    xValue: errors.xValueError,
    yValue: errors.yValueError,
    fill: "#222",
};

function doonut(options) {
    options = extend(DEFAULTS, options);


    var width = options.width - options.marginLeft - options.marginRight,
        height = options.height - options.marginTop - options.marginBottom,
        marginTop = options.marginTop,
        marginRight = options.marginRight,
        marginBottom = options.marginBottom,
        marginLeft = options.marginLeft,
        color       = d3.scale.ordinal().range(["#ccc", "#666"]);

    var chart = function chart(selection) {
        selection.each(function(data) {

            var svg = d3.select(this).selectAll("svg").data([data]);

            var gEnter = svg.enter().append("svg").append("g");
            gEnter.append("g").attr("class", "x axis");
            gEnter.append("g").attr("class", "y axis");

            // Update the outer dimensions.
            svg.attr("width", width)
                .attr("height", height);

            // Update the inner dimensions.
            var g = svg.select("g")
                .attr("transform", "translate(" + [width/2, height/2] + ")");

            var radius = Math.min(width, height)/2;

            var arc = d3.svg.arc()
                .outerRadius(radius - 10)
                .innerRadius(radius - 60);

            var pie = d3.layout.pie()
                .sort(null)
                .value(options.yValue);

            var gArc = g.selectAll(".arc")
                .data(pie(data))
                .enter()
                .append("g")
                .attr("class", "arc");

            gArc.append("path")
                .attr("d", arc)
                .style("fill", function(d) { return color(d.data.category); });

            gArc.append("text")
                .attr("transform", function(d) { return "translate(" + arc.centroid(d) + ")"; })
                .attr("dy", ".35em")
                .style("text-anchor", "middle")
                .text(function(d) { return "" && d.data.category; });


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

    chart.fill = function(color) {
        if (!arguments.length) return options.fill;
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

    return chart;
}

function donut(selection, percent) {
    percent = percent || Math.random()*60 + 20;
    var data = fakeData(percent);
    var width = parentWidth(selection),
        height = 220,
        radius = Math.min(width, height)/2;

    var color = d3.scale.ordinal()
        .range(["#5aa5be", "#ef412d"]);

    var arc = d3.svg.arc()
        .outerRadius(radius - 10)
        .innerRadius(radius - 60);

    var pie = d3.layout.pie()
        .sort(null)
        .value(function(d) { return d.count; });

    var svg = selection.attr({
            width: width,
            height: height,
        })
        .append("g")
        .attr("transform", "translate("+[width/2, height/2]+")");

    var g = svg.selectAll(".arc")
        .data(pie(data))
        .enter()
        .append("g")
        .attr("class", "arc");

    g.append("path")
        .attr("d", arc)
        .style("fill", function(d) { return color(d.data.category); });

    g.append("text")
        .attr("transform", function(d) { return "translate(" + arc.centroid(d) + ")"; })
        .attr("dy", ".35em")
        .style("text-anchor", "middle")
        .text(function(d) { return "" && d.data.category; });
}


function fakeData(n) {
    var result = [];
    result.push({
        category: "ask",
        count: n,
    });
    result.push({
        category: "offer",
        count: 100-n,
    });
    return result;
}