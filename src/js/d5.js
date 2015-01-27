var d3      = require("d3"),
    $       = require ("jquery"),
    stampit = require("stampit");

global.d5 = (function(){
    return {
        me: function() { console.log("Hey hey hey"); console.log(this); },
        stampit: stampit,
        d3: d3,
        $: $,
    };
})();

module.exports = d5;