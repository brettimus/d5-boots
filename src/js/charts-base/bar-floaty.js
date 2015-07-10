var d3 = require('d3'),
    merge = require("merge");

module.exports = barGraph;

function barGraph(options) {
    var DEFAULTS = {
        margin: {
            top: 10,
            right: 10,
            bottom: 25,
            left: 25,
        },
        height: 300,
        width: 400,
        colors: {
            color: ["#AE2B3D", "#115ABC", "#4208A1", "#00A24F", "#00A24F", "#F7C019", "#ED8C18"]
        },
        legend: {
          height: 60,
          width: 50,
        },
    };
    
    options = merge.recursive(true, {}, DEFAULTS, options || {});

    var height = options.height,
        width  = options.width,
        margin = options.margin;

    function chart(selection) {

        selection.each(function(data) {
            var yMax = 0;

            for (var i = 0; i < data.length; i++) {
                if (data[i].y > yMax) {
                    yMax = data[i].y;
                }
            }

            var xScale = d3.scale.ordinal()
                .domain(d3.range(data.length))
                .rangeRoundBands([margin.left, width - margin.left - margin.right], 0.05);

            var yScale = d3.scale.linear()
                .domain([0, yMax + 5])
                .range([height - margin.top - margin.bottom, margin.bottom]);

            var svg = d3.select(this)
                .selectAll("svg")
                .data([data])
                .enter()
                .append("svg");

            svg.attr("width", width)
                .attr("height", height);

            var group = svg.append("g").attr("transform", "translate(" + [margin.left, margin.top] + ")");
            group.append("g").attr("class", "x axis");
            group.append("g").attr("class", "y axis");
            group.append("g").attr("class", "rects");
          
           
            svg.attr("width", width)
                .attr("height", height);

            var g = svg.selectAll("g");
           
            var graph = g.select(".rects");
            graph.append("g").attr("class", "bars");
            graph.select(".bars").selectAll("rect")
                .data(data)
                .enter()
                .append("rect")
                .attr({
                    x: function(d){ return xScale(d.x); },
                    y: function(d){ return yScale(d.y); },
                    height: function(d) {
                        return height - margin.top - margin.bottom - yScale(d.y);
                    },
                    width: xScale.rangeBand,
                    fill: function(d, i){
                        return options.colors.color[i%options.colors.color.length];
                    },
                    opacity: 0.25,
                });

            graph.append("g").attr("class", "topBars");
            graph.select(".topBars").selectAll("rect")
                .data(data)
                .enter()
                .append("rect")
                .attr({
                    x: function(d) { return xScale(d.x); },
                    y: function(d) { return yScale(d.y); },
                    width: xScale.rangeBand,
                    height: 3,
                    fill: function(d, i) {
                        return options.colors.color[i%options.colors.color.length];
                    }
                });

            graph.append("g").attr("class", "labels");
            graph.select(".labels").selectAll("text")
                .data(data)
                .enter()
                .append("text")
                .text(function(d){
                  return d.y;
                })
                .attr({
                    x: function(d) {
                        return xScale(d.x) + xScale.rangeBand() / 2;
                    },
                    y: function(d) {
                        return yScale(d.y) - 2;
                    },
                    "text-anchor": "middle",
                    "font-size": "12px",
                    "font-family": "Helvetica, sans-serif",
                    "color": "#222",
                });

            xAxis = d3.svg.axis();
            xAxis.scale(xScale)
                .orient("bottom")
                .ticks(5);
            yAxis = d3.svg.axis()
                .scale(yScale)
                .orient("left")
                .ticks(5);

            g.select(".x.axis")
                .attr("transform", "translate(" +[0, height - margin.top - margin.bottom] + ")")
                .call(xAxis);

            g.select(".y.axis")
                .attr("transform", "translate("+ margin.left + ", 0)")
                .call(yAxis);

        });
    }
    
    chart.width = function(value){
        if (!arguments.length) return width;
        width = value;
        return chart;
    };

    chart.height = function(value){
        if (!arguments.length) return height;
        height = value;
        return chart;
    };

    chart.margin = function(value){
        if(!arguments.length) return margin;
        margin = value;
        return chart;
    };

    return chart;
}