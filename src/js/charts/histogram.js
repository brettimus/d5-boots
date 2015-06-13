var d3 = require("d3"),
    Boo = require("boo-templates"),
    extend = require("boots-utils").extend,
    parentWidth = require("../utils").parentWidth,
    errors = require("../errors");

var t = "<h5>"+
        "{{year}}"+
        "</h5>"+
        "<div>"+
        "{{count}} Users"+
        "</div>";

var template = new Boo(t);


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

module.exports = hist;

function hist(options) {
    options = extend(DEFAULTS, options);


    var width = options.width - options.marginLeft - options.marginRight,
        height = options.height - options.marginTop - options.marginBottom,
        marginTop = options.marginTop,
        marginRight = options.marginRight,
        marginBottom = options.marginBottom,
        marginLeft = options.marginLeft,
        xScale      = d3.scale.ordinal().rangeRoundBands([0, width], 0.1),
        yScale      = d3.scale.linear(),
        color       = d3.scale.linear().range(["#ccc", "#666"]),
        xAxis       = d3.svg.axis().scale(xScale).orient("bottom").ticks(d3.time.months, 1).tickFormat(d3.time.format("%b '%y")),
        yAxis       = d3.svg.axis().scale(yScale).orient("left");


    var chart = function chart(selection) {

        selection.each(function(data) {

            xScale
                .rangeRoundBands([0, width], 0.1)
                .domain(data.map(options.xValue));


            var attrs = {
                "class": "bar",
                fill: function(d) { return color(options.xValue(d)); },
                x: function(d) { return xScale(options.xValue(d)); },
                y: function(d) { return yScale(options.yValue(d)); },
                width: xScale.rangeBand(),
                height: function(d) { return height - marginBottom - marginTop - yScale(options.yValue(d)); },
            };


            // Update the y-scale.
            yScale
                .domain([0, d3.max(data, options.yValue)])
                .range([height - marginTop - marginBottom, 0]);

            color
                .domain(d3.extent(data, options.yValue));

            xAxis.scale(xScale);
            yAxis.scale(yScale);

            var svg = d3.select(this).selectAll("svg").data([data]);

            var gEnter = svg.enter().append("svg").append("g");
            gEnter.append("g").attr("class", "x axis");
            gEnter.append("g").attr("class", "y axis");

            // Update the outer dimensions.
            svg.attr("width", width)
                .attr("height", height);

            // Update the inner dimensions.
            var g = svg.select("g")
                .attr("transform", "translate(" + [marginLeft, marginTop] + ")");

            // Update the bars.
            g.selectAll(".bar")
                .data(data)
                .enter()
                .append("rect")
                .attr(attrs);

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

    return chart;
}

function histogram(selection, data, options) {
    if (!data) data = randomData(1950, 2020);
    options = options || {};
    var width = parentWidth(selection);
    var height = 200;


    selection.attr({
        height: height,
        width: width,
    });

    var tip = d3.tip()
            .attr('class', "argus-tooltip")
            .html(function(d) {
                return template.compile(d);
            });
    selection.call(tip);

    var x = d3.scale.ordinal().rangeRoundBands([0, width], 0.1),
        y = d3.scale.linear().range([height, 0]),
        color = d3.scale.linear().range(["#ccc", "#666"]);

    x.domain(data.map(function(d) { return d.year; }));
    y.domain(d3.extent(data, function(d) { return d.count; }));
    color.domain(d3.extent(data, function(d) { return d.count; }));

    var bars = selection.selectAll(".argus-bar").data(data);
    var attrs = {
            "class": "argus-bar",
            fill: function(d) { return color(d.count); },
            x: function(d) { return x(d.year); },
            y: function(d) { return y(d.count); },
            width: x.rangeBand(),
            height: function(d) { return height - y(d.count); },
        };


    bars
        .transition()
        .duration(400)
        .attr(attrs);

    bars
        .enter()
        .append("rect")
        .attr(extend({}, attrs, {y: height})); // bars start out flat

    window.requestAnimationFrame(function() {
        bars
            .transition("rise-in")
            .duration(600)
            .delay(function(d,i) { return i*15; })
            .attr("y", attrs.y);
    });

    bars
        .on("mouseover", function(d) {
          tip.show(d);
        })
        .on("mouseout", tip.hide)
        .on("click", function(d){
            if (options.click) {
                options.click(d);
            }
        });

    bars.exit()
        .transition()
        .attr("height", 0)
        .remove();
}