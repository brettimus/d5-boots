var merge = require('merge');

module.exports = Chart;

/**
 * Defines all the common getter setter functions and configurations of plots.
 * Default values are provided by config. Leaves method makeChart open to be
 * defined for specific chart types.
 */
function Chart(config) {
    var DEFAULTS = {
        title: 'FUN TIME 2K15 CHART',
        width: 600,
        height: 400,
        xlab: 'THE X AXIS',
        ylab: 'THE Y AXIS',
        margin: {
            top: 20,
            right: 20,
            bottom: 40,
            left: 20,
        },
    };

    // merge in defaults  
    config = merge.recursive(true, {}, DEFAULTS, config || {});

    var title  = config.title,
        width  = config.width,
        height = config.height,
        xlab   = config.xlab,
        ylab   = config.ylab,
        margin = config.margin,
        x, y, makeChart;

    chart = function(selection) {
        // Leave the function defining to others
        return makeChart(selection);
    };

    chart.setMakeChart = function(func) {
        if (typeof func !== 'function') return undefined;
        makeChart = func;
        return chart;
    };

    chart.title =  function(new_title) {
        if (new_title === undefined) return title;
        title = new_title;
        return chart;
    };

    chart.ylab = function(new_ylab) {
        if (new_ylab === undefined) return ylab;
        ylab = new_ylab;
        return chart;
    };

    chart.xlab = function(new_xlab) {
        if (new_xlab === undefined) return xlab;
        xlab = new_xlab;
        return chart;
    };

    chart.width = function(new_width) {
        if (new_width === undefined) return width;
        width = new_width;
        return chart;
    };

    chart.height = function(new_height) {
        if (new_height === undefined) return height;
        height = new_height;
        return chart;
    };

    chart.margin = function(value) {
        if (!arguments.length) return margin;
        margin = value;
        return chart;
    };

    chart.marginTop = function(value) {
        if (!arguments.length) return margin.top;
        margin.top = value;
        return chart;
    };
    chart.marginLeft = function(value) {
        if (!arguments.length) return margin.left;
        margin.left = value;
        return chart;
    };
    chart.marginBottom = function(value) {
        if (!arguments.length) return margin.bottom;
        margin.bottom = value;
        return chart;
    };
    chart.marginRight = function(value) {
        if (!arguments.length) return margin.right;
        margin.right = value;
        return chart;
    };

    chart.x = function(new_x) {
        if (!arguments.length) {
          return x;
        }
        x = new_x;
        return chart;
    };

    chart.y = function(new_y) {
        if (!arguments.length) {
          return y;
        }
        y = new_y;
        return chart;
      };

    chart.group = function(new_group) {
        if (!arguments.length) {
            return group;
        }
        group = new_group;
        return chart;
    };

    chart.makeTitle = function(selection) {
        selection.append('text')
            .attr({
                'class': 'chart-title',
                'x': width / 2,
                'y': margin.top / 2
            })
            .text(title);
    };

    chart.makeAxisLabels = function(selection) {
      selection.append('text')
          .attr({
              'class': 'axis-label',
              'x': width / 2,
              'y': height - (margin.bottom / 2),
          })
          .text(xlab);

      selection.append('text')
          .attr({
              'class': 'axis-label',
              'x': margin.top * 0.1,
              'y': height / 2,
          })
          .text(ylab);
    };

    chart.makeAxes = function(selection, xscale, yscale) {
        var xaxis = d3.svg.axis()
            .scale(xscale)
            .orient('bottom')
            .ticks(5);
        var yaxis = d3.svg.axis()
            .scale(yscale)
            .orient('left')
            .ticks(5);
        selection.append('g')
            .attr('class', 'axis')
            .attr('transform', 'translate(0, ' +
              (height - margin.bottom - margin.top) + ')')
            .call(xaxis);
        selection.append('g')
            .attr('class', 'axis')
            .call(yaxis);
    };

    /**
     * Takes data and creates an array of data sets based on the grouping var
     */
    chart.groupData = function(data) {
        // First figure out what groupings there are
        var groupings = [];
        for (var i = 0; i < data.length; i++) {
            var group = this.group()(data[i]);
            if (groupings.indexOf(group) === -1) {
                groupings.push(group);
            }
        }

        // For each of the groupings, filter the data and make a line
        var self = this;
        function groupFilter(i) {
            return function(d) {
                return self.group()(d) === groupings[i];
            };
        }
        groupings = groupings.map(function(d, i) {
            var new_data = data.filter(groupFilter(i));

            return {
                group: d,
                data: new_data
            };
        });

        return groupings;
    };

    /**
     * makeGroupLabels: creates labels for grouped data
     */
    chart.makeGroupLabels = function(selection, labelData) {
        var labels = selection.selectAll('.group-label')
            .data(labelData)
            .enter()
            .append('g')
            .attr('class', 'group-label')
            .attr('transform', 'translate(' + (width - margin.left) +
              ', ' + (height / 3) + ')');

        var self = this;
        lineColors = function(d) {
            var group = self.group()(d.data[0]);
            return self.groupScale(group);
        };

        labels.append('rect')
            .attr({
                fill: lineColors,
                width: 16,
                height: 16,
                x: 0,
                y: function(d, i) { return i * 18; }
            });

        labels.append('text')
            .attr({
                x: 20,
                y: function(d, i) { return i * 18 + 16; }
            })
            .text(function(d) { return self.group()(d.data[1]); });
    };

    return chart;
}