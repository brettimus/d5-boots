var d3 = require('d3'),
    merge = require('merge');

module.exports = line;

/**
 * Makes a line chart function.
 * @constructor
 */
function line(user_config) {
    // Get the configurations
        var DEFAULTS = {
        // Labels
        title : 'FUN TIME 2K15 CHART',
        xlab : 'THE X AXIS',
        ylab : 'THE Y AXIS',
        // Measurements
        width : 600,
        height : 400,
        margin : {
            top : 20,
            right : 20,
            bottom : 40,
            left : 20
        },
        // Data accessors
        x : undefined,
        y : undefined,
        group : undefined,
        // Scales
        xScale : d3.scale.linear(),
        yScale : d3.scale.linear(),
        groupScale : d3.scale.category10(),
        // Misc
        tip: undefined
    };

    var config = merge.recursive(true, DEFAULTS, user_config || {});

    // Define the make chart function
    function chart(selection) {
        // Create an SVG if there isn't one
        selection.each(function(data) {
            var svg = d3.select(this)
                .selectAll("svg")
                .data([data])
                .enter()
                .append('svg');

            // Check on the accessor functions
            if (config.x === undefined) throw new Error('X accessor undefined');
            if (config.y === undefined) throw new Error('Y accessor undefined');
            if ( isNaN(config.x(data[0])) ) throw new Error('X Accessor give NaN!');
            if ( isNaN(config.y(data[0])) ) throw new Error('Y Accessor gives NaN!');
            if ( config.group !== undefined && config.group !== null
                && !config.group(data[0]) )
                throw new Error('Group accessor is not valid');

            // Create the inner group for the contents of the chart
            var translation = 'translate(' + [config.margin.left, config.margin.top] + ')';
            var inner = svg.append('g')
                  .attr('transform', translation);

            // First get the SVG the right size
            svg.attr({
                width: config.width,
                height: config.height
            });

            // Create the headers and labels
            makeTitle(svg, config);
            makeAxisLabels(svg, config);

            // Setting up the scales
            config.xScale
                  .domain(d3.extent(data, config.x))
                  .range([0, config.width - config.margin.left - config.margin.right]);

            config.yScale
                  .domain([0, d3.max(data, config.y)])
                  .range([config.height - config.margin.top - config.margin.bottom, 0]);

            // Draw the axes
            makeAxes(inner, config);

            // Create line or set of lines
            var line = d3.svg.line()
                    .x(sequence(config.x, config.xScale))
                    .y(sequence(config.y, config.yScale));

            var lineLabels;

            if (config.group !== undefined && config.group !== null) {
                lineLabels = createLines(inner, data, config, line);
                makeGroupLabels(svg, lineLabels, config);
            }
            else
                createLines(inner, data, config, line);

        });
    }

    /**
     * All of the getters and setters
     */
    chart.x = function (new_x) {
        if (new_x === undefined) {
            if (config.x === undefined)
                throw new Error('The X accessor function is not defined');
            else
                return config.x;
        }
        config.x = new_x;
        return chart;
    };
    chart.y = function (new_y) {
        if (new_y === undefined) {
            if (config.y === undefined)
                throw new Error('The Y accessor function is not defined');
            else
                return config.y;
        }
        config.y = new_y;
        return chart;
    };
    function getSet(varname) {
        return function (new_value) {
            if (new_value === undefined) return config[varname];
            config[varname] = new_value;
            return chart;
        };
    }
    chart.width = getSet('width');
    chart.height = getSet('height');
    chart.title = getSet('title');
    chart.xlab = getSet('xlab');
    chart.ylab = getSet('ylab');

    chart.group = function (new_group) {
      if (new_group === undefined) return config.group;
        config.group = new_group;
        return chart;
    };


    return chart;
}

function createLines(element, data, config, line) {

    var groupings = groupData(data, config);

    // Now create the lines
    var lines = d3.select('svg').select('g')
        .selectAll('.line-grouping')
        .data(groupings);

    lines.enter()
        .append('g')
        .attr('class', 'line-grouping')
        .append('path')
        .attr('class', 'line')
        .attr('d', function(d) { return line(d.data); })
        .attr({
            fill : 'none',
            stroke : sequence(getGroup, config.groupScale)
        });
    lines.exit().remove();

    function getGroup(d) { return d.group; }

    return groupings;
}


function sequence() {
    var fns = arguments;

    return function (result) {
        for (var i = 0; i < fns.length; i++) {
            result = fns[i].call(this, result);
        }

        return result;
    };
};

/**
 * @function groupData Separates the data based on the grouping.
 * @param {array of objects} data the data to be split
 * @param {config object} config the configuration object of the chart
 * @returns {array} Returns an array of objects, each with a `group` property giving the
 *   name of the group and a `data` property with the data from that group.
 */
function groupData (data, config) {
    // First get the set of groupings
    var groupings;
    if (config.group !== undefined && config.group !== null) {
        groupings = d3.set(data.map(config.group)).values();
        // For each of the groups, collect the relevant data
        groupings = groupings.map(extractGroup);
    } else {
        groupings = [{ group : 'data', data : data }];
    }
    return groupings;

    function groupFilter(i) {
        return function (d) {
            return config.group(d) === groupings[i];
        };
    }
    function extractGroup(d, i) {
        var new_data = data.filter(groupFilter(i));
        return {
            group : d,
            data : new_data
        };
    }
}

/**
 * @function makeGroupLabels Creates labels for the groupings. Each labels has a colored
 * rectangle and a text label. The text label is based on the category in group.
 * @param {d3 selection} selection the element to add the group labels to
 */
function makeGroupLabels (selection, labelData, config) {
    var position = [config.width - config.margin.left,
                    config.height / 3];
    var legend = d3.legend.color().scale(config.groupScale);
    selection.append('g')
        .attr('class', 'legend group-legend')
        .attr('transform', 'translate(' + position + ')')
        .call(legend);
}

/**
 * @function makeTitle Creates an title in the chart
 * @param {d3 selection} selection the SVG element to add the text node to
 * @param {dict} config the chart configuration dictionary
 */
function makeTitle (selection, config) {
    selection.append('text')
        .attr({
            class : 'chart-title',
            x : config.width / 2,
            y : config.margin.top / 2
        })
        .text(config.title);
}
/**
 * @function makeAxisLabels
 * @param {d3 selection} selection the SVG element to add the axes labels to
 * @param {dict} config the chart configuration dictionary
 */
function makeAxisLabels(selection, config) {
    selection.append('text')
        .attr({
            class : 'axis-label',
            x : config.width / 2,
            y : config.height - (config.margin.bottom / 2)
        })
        .text(config.xlab);

    selection.append('text')
        .attr({
            class : 'axis-label',
            x : config.margin.top * 0.1,
            y : config.height / 2
        })
        .text(config.ylab);
}
/**
 * @function makeAxes
 * @param {d3 selection} selection the SVG element to add the axes to
 * @param {dict} config the chart configuration dictionary
 */
function makeAxes(selection, config) {
    var xaxis = d3.svg.axis()
            .scale(config.xScale)
            .orient('bottom')
            .ticks(5);
    var yaxis = d3.svg.axis()
            .scale(config.yScale)
            .orient('left')
            .ticks(5);
    // Offset of the X-Axis
    var yOffset = config.height - config.margin.bottom - config.margin.top;
    selection.append('g')
        .attr('class', 'axis')
        .attr('transform', 'translate(0, ' + yOffset + ')')
        .call(xaxis);
    selection.append('g')
        .attr('class', 'axis')
        .call(yaxis);

}
