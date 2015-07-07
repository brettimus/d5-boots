var d3         = require("d3");
var charts     = require("./charts-base");
var extend     = require("./extend");
var utils      = require("./utils");

global.d3 = d3;
global.d5 = (function(){
    
    function d5(selector, data, charter) {
        var charty = d3.select(selector);

        if (data)    charty.datum(data);
        if (charter) charty.call(charter);

        charty.update = function update(newCharter) {
            if (newCharter) charter = newCharter;
            this.call(charter);
            return this;
        };

        return charty;
    }

    // Mixin charting functions to main object
    extend(d5, charts);
    d5.utils = utils;
    d5.d3    = d3;

    return d5;

})();

module.exports = d5;