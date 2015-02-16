var d3      = require("d3");

global.d5 = (function(){
    return {
        me: function() { console.log("Hey hey hey"); console.log(this); },
        d3: d3,
    };
})();

module.exports = d5;