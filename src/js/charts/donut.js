var d3 = require("d3"),
    parentWidth = require("../utils").parentWidth;

module.exports = donut;

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