var d3 = require('d3'),
    Chart = require('./chart-class');


module.exports = scatter;

/**
 * Constructor for a scatterplot chart function
 */
function scatter(config) {
    var pointChart = new Chart(config);

    // Define the make chart function
    pointChart.setMakeChart(chartMaker);

    function chartMaker(selection) {
        selection.each(function(data) {

            var svg = d3.select(this)
                .selectAll('svg')
                .data([data])
                .enter()
                .append('svg');

            var margin = pointChart.margin();

            var translation = 'translate(' + [margin.left, margin.top] + ')';
            var inner = svg.append('g')
                  .attr('transform', translation);

            // var tip = d3.tip()
            //         .attr('class', "d5-tooltip")
            //         .html(options.templater);
            // svg.call(tip);

            // Make svg size
            svg.attr({
                width: pointChart.width(),
                height: pointChart.height()
            });

            // Create the headers and labels
            pointChart.makeTitle(svg);
            pointChart.makeAxisLabels(svg);


            // Setting up the scales
            var xscale = d3.scale.linear()
                  .domain(d3.extent(data, pointChart.x()))
                  .range([0, pointChart.width() - margin.left - margin.right]);

            var yscale = d3.scale.linear()
                  .domain(d3.extent(data, pointChart.y()))
                  .range([pointChart.height() - margin.bottom - margin.top, 0]);

            // Draw the axes
            pointChart.makeAxes(inner, xscale, yscale);

            // Draw the points
            var pointLabels;
            if (pointChart.group() !== null) {
                pointChart.groupScale = d3.scale.category10();
                pointLabels = createPoints(inner, data, pointChart, xscale, yscale);
                // Draw the point labels
                pointChart.makeGroupLabels(svg, pointLabels);
            }

            // Add tooltip
            selection
                .append('div')
                .attr({
                    id: 'tooltip',
                    "class": 'hidden',
                });
        });
    }

    return pointChart;
}


function createPoints(selection, data, chart, xscale, yscale) {
    var groupings = chart.groupData(data);

    // Now create the points
    var groups = selection.selectAll('.point-grouping')
        .data(groupings)
        .enter()
        .append('g')
        .attr('class', 'point-grouping');

    groups.each(function (data) {
        d3.select(this).selectAll('circle')
            .data(data.data)
            .enter()
            .append('circle')
            .attr({
                cx: function(d) { return xscale(chart.x()(d)); },
                cy: function(d) { return yscale(chart.y()(d)); },
                r: 3,
                fill: function(d) { return chart.groupScale(chart.group()(d)); }
            });
            // .on('mouseover', tip.show)
            // .on('mouseout', tip.hide);
    });
    return groupings;
}
