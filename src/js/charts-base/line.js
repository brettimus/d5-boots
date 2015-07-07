var d3 = require('d3');
var Chart = require('./chart-class').Chart;
/**
 * Constructor for a line chart function
 */
module.exports = function(config) {

  var lineChart = new Chart(config);

  // Define the make chart function
  lineChart.setMakeChart(
    function (selection) {
      selection.each(function(data) {
    var svg = d3.select(this).selectAll("svg").data([data]).enter().append('svg');
    var inner = svg.append('g')
          .attr('transform', 'translate(' + lineChart.margin() + ', ' +
            lineChart.margin() + ')');

    // First get the SVG the right size
    svg.attr({width: lineChart.width(),
          height: lineChart.height()});


    // Create the headers and labels
    lineChart.makeTitle(svg);
    lineChart.makeAxisLabels(svg);

    // Setting up the scales
    var scalex = d3.scale.linear()
          .domain(d3.extent(data, lineChart.x()))
          .range([0,
              lineChart.width() - 2 * lineChart.margin()]);

    var scaley = d3.scale.linear()
          .domain([0, d3.max(data, lineChart.y())])
          .range([lineChart.height() - 2 * lineChart.margin(),
              0]);

    // Draw the axes
    lineChart.makeAxes(inner, scalex, scaley);

    // Create line or set of lines
    var line = d3.svg.line()
          .x(function(d) { return scalex(lineChart.x()(d)); })
          .y(function (d) { return scaley(lineChart.y()(d)); });
    var lineLabels;
    if (lineChart.group() !== null) {
      lineChart.groupScale = d3.scale.category10();
      lineLabels = createLines(inner, data, lineChart, line);
      }
    else
      createLine(inner, data, lineChart);

    // Create labels for the lines
    if (lineChart.group() !== null)
      lineChart.makeGroupLabels(svg, lineLabels);

      });
    });

  return lineChart;
};

function createLines(element, data, lineChart, line) {

  var groupings = lineChart.groupData(data);

  // Now create the lines
  d3.select('svg').select('g')
    .selectAll('.line-grouping')
    .data(groupings)
    .enter()
    .append('g')
    .attr('class', 'line-grouping')
    .append('path')
    .attr('class', 'line')
    .attr('d', function(d) { return line(d.data); })
    .attr({fill: 'none',
       stroke: function(d) { return lineChart.groupScale(lineChart.group()(d.data[1])); }
       });
  return groupings;
}

