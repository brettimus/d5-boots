var d3 = require("d3"),
    Boo = require("boo-templates"),
    extend = require("boots-utils").extend,
    parentWidth = require("../utils").parentWidth;

var t = "<h5>"+
        "{{year}}"+
        "</h5>"+
        "<div>"+
        "{{count}} Users"+
        "</div>";

var template = new Boo(t);


histogram.randomData = randomData;
module.exports = histogram;

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




function randomData(a, b) {
    var mean = (a+b)/2,
        sd = (b-a)/6,
        normal = d3.random.normal(mean, sd),
        result = [],
        data = bootstrap(3000, normal);
        // console.log(data);
    for (;a <= b; ++a) {
        result.push({
            year: a,
            count: data[a] || 0,
        });
    }
    return result;
}

function bootstrap(n, f) {
    var i = 0,
        tmp,
        result = {};
    for (;i<=n; ++i) {
        tmp = Math.floor(f());
        if (!result[tmp]) result[tmp] = 0;
        result[tmp]++;
    }
    return result;
}