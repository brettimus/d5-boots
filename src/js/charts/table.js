var Boo = require("boo-templates");

var t = "<td>{{month}}</td>"+
        "<td class=\"argus-table-number\">{{count}}</td>"+
        "<td class=\"argus-table-percent\">{{growth}}</td>";

var template = new Boo(t);

module.exports = table;

function table(elt, data) {
    d3.select(elt)
        .selectAll("tr.argus-tr")
        .data(data)
        .enter()
        .append("tr")
        .classed("argus-tr", true)
        .html(function(d){ return template.compile(d); });
}