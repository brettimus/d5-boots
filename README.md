# d5 (ddddd)
**don't duplicate data driven documents**

## about

Some sugar for creating a d3 timeseries chart.

Heavily inspired by M. Bostock's [Towards Reusable Charts](http://bost.ocks.org/mike/chart/).

## usage

* include `d5.js` or `d5.min.js` (from the `dist` folder) on your page 

```html
<script src="/path/to/d5.js"></script>
```

* place a chart element on the same page

```html
  <div id="#chart"></div>
```

* choose the type of chart you want (_hint: there's only one right now_)

```javascript
  var opts = {}; // configure some stuff
  var charter = d5.timeSeries(opts);
```

* d5 it up

```javascript
  var selector = "#chart";
  var data = d5.utils.timeSeriesData(); // grab some random data

  // IMPORTANT!
  // * you have set set accessor functions for your data on `charter`
  charter.x(function(d) { return d[0]; });
  charter.y(function(d) { return d[1]; });

  // Now we're ready to go!

  // try this
  var charty = d5(selector, data, charter);
  // or this
  var charty = d5(selector, data).update(charter);
  // or even this
  var charty = d5(selector).datum(data).update(charter);
```

## what's included

**TODO**
:grin: