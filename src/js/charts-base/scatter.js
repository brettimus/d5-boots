var d3 = require('d3');
var Chart = require('./chart-class');
/**
 * Constructor for a scatterplot chart chart function
 */
module.exports = function scatter(config) {
  var pointChart = new Chart(config);

  // Define the make chart function
  pointChart.setMakeChart(
    function(selection) {
      selection.each(function(data) {
    var svg = d3.select(this).selectAll('svg').data([data]).enter().append('svg');
    var inner = svg.append('g')
          .attr('transform', 'translate(' + pointChart.margin() + ', ' +
            pointChart.margin() + ')');

    // Make svg size
    svg.attr({width: pointChart.width(),
          height: pointChart.height()});

    // Create the headers and labels
    pointChart.makeTitle(svg);
    pointChart.makeAxisLabels(svg);

    // Setting up the scales
    var xscale = d3.scale.linear()
          .domain(d3.extent(data, pointChart.x()))
          .range([0,
              pointChart.width() - 2 * pointChart.margin()]);

    var yscale = d3.scale.linear()
          .domain(d3.extent(data, pointChart.y()))
          .range([pointChart.height() - 2 * pointChart.margin(),
              0]);

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
    selection.append('div')
      .attr({id: 'tooltip',
         class: 'hidden'});

      });
    }
  );

  return pointChart;
};


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
      .attr({cx: function(d) { return xscale(chart.x()(d)); },
         cy: function(d) { return yscale(chart.y()(d)); },
         r: 3,
         fill: function(d) { return chart.groupScale(chart.group()(d)); }
        })
    .on('mouseover', showTooltip(chart))
    .on('mouseout', hideTooltip);
  });
  return groupings;
}

function showTooltip(chart) {
  return function (data) {
    // `this` refers the the point that is being moused over
    var tooltip = d3.select('#tooltip');

    var xPos = d3.event.pageX;
    var yPos = d3.event.pageY;

    tooltip.style('left', xPos + 'px')
      .style('top', yPos + 'px');

    tooltip = tooltip.selectAll('.tooltip-data')
      .data([data])
      .enter()
      .append('span')
      .attr('class', 'tooltip-data');

    // Add group
    var group = tooltip.append('p');
    group.append('span')
      .style('color', chart.groupScale(chart.group()(data)))
      .attr('class', 'tooltip-label')
      .text(function(d) {console.log(d); return chart.group()(d);});

    // Add x
    var x = tooltip.append('p');
    x.append('span')
      .attr('class', 'tooltip-label')
      .text(chart.xlab() + ': ');
    x.append('span')
      .attr('class', 'tooltip-value')
      .text(function(d) { return chart.x()(d); });

    // Add y
    var y = tooltip.append('p');
    y.append('span')
      .attr('class', 'tooltip-label')
      .text(chart.ylab() + ': ');
    y.append('span')
      .attr('class', 'tooltip-value')
      .text(function(d) { return chart.y()(d); });


    d3.select('#tooltip').classed('hidden', false);

    d3.select(this).attr('r', 6);
};
}
function hideTooltip(data) {
  var tooltip = d3.select('#tooltip').classed('hidden', true);
  d3.select(this).attr('r', 3);
//  d3.select('#tooltip')
//    .
}
