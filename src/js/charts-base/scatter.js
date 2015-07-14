var d3 = require('d3'),
    merge = require('merge');


module.exports = scatter;

/**
 * Constructor for a scatterplot chart function
 */
function scatter(user_config) {
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

    var config = merge.recursive(true, {}, DEFAULTS, user_config || {});

    // Define the function to create the chart
    function chart(selection) {
        selection.each(function(data) {
            // Create an SVG if there isn't one
            var svg = d3.select(this)
                .selectAll('svg')
                .data([data])
                .enter()
                .append('svg');
            // Create the inner group for the contents of the chart
            var translation = 'translate(' + [config.margin.left, config.margin.top] + ')';
            var inner = svg.append('g')
                  .attr('transform', translation);

            // Tooltip
            function coordinates(d) {
                return config.xlab + ': ' + config.x(d) + '\n' + config.ylab + ': ' + config.y(d);
            }
            config.tip = d3.tip()
                    .attr('class', "d5-tooltip")
                    .html(coordinates);
            svg.call(config.tip);

            // Make svg size
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
                .domain(d3.extent(data, config.y))
                .range([config.height - config.margin.bottom - config.margin.top, 0]);

            // Draw the axes
            makeAxes(inner, config);

            // Draw the points
            var pointLabels;
            if (config.group !== undefined) {
                pointLabels = createPoints(inner, data, config);
                // Draw the point labels
                makeGroupLabels(svg, pointLabels, config);
            }

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



/**
 * @function createPoints draws the poinst in the scatter plot
 * @param {d3 selection} selection the SVG element to add the points to
 * @param {array of objects} data the data to be plotted
 * @param {object} config the chart config object
 */
function createPoints(selection, data, config) {
    // Get the groups of data
    var groupings = groupData(data, config);

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
                cx : function(d) { return config.xScale(config.x(d)); },
                cy : function(d) { return config.yScale(config.y(d)); },
                r : 3,
                fill : function(d) { return config.groupScale(config.group(d)); }
            })
            .on('mouseover', config.tip.show)
            .on('mouseout', config.tip.hide);
    });
    return groupings;
}


/**
 * @function groupData Separates the data based on the grouping.
 * @param {array of objects} data the data to be split
 * @param {config object} config the configuration object of the chart
 * @returns {array} Returns an array of objects, each with a `group` property giving the
 *   name of the group and a `data` property with the data from that group.
 */
function groupData (data, config) {
    // First get the set of groupings
    var groupings = d3.set(data.map(config.group)).values();
    // For each of the groups, collect the relevant data
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
    groupings = groupings.map(extractGroup);
    return groupings;
}
/**
 * @function makeGroupLabels Creates labels for the groupings. Each labels has a colored
 * rectangle and a text label. The text label is based on the category in group.
 * @param {d3 selection} selection the element to add the group labels to
 */
function makeGroupLabels (selection, labelData, config) {
    var position = [config.width - config.margin.left,
                    config.height / 3],
        labels = selection.selectAll('.group-label')
            .data(labelData)
            .enter()
            .append('g')
            .attr('class', 'group-label')
            .attr('transform', 'translate(' + position + ')');
    function lineColors (d) {
        var group = config.group(d.data[0]);
        return config.groupScale(group);
    }
    labels.append('rect')
        .attr({
            fill : lineColors,
            width : 16,
            height : 16,
            x : 0,
            y : function (d, i) { return 18 * i; }
        });
    labels.append('text')
        .attr({
            x : 20,
            y : function (d, i) { return i * 18 + 16; }
        })
        .text(function (d) { return config.group(d.data[1]); });
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
