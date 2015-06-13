# d5 (ddddd)
**don't duplicate data driven documents**
A forthcoming d3 charting library from Shrimpbird Labs

## To Get Going
* All source javascript lives in `src/js`. 
* All charting functions live in `src/js/charts`

You need your dependencies. Run `npm install` in the project root.

You need `grunt` to build the `src` files. 
Install [grunt-cli](https://www.npmjs.com/package/grunt-cli) with 
`npm install grunt-cli`.

To build the source files, simply type `grunt`.

If you are making a lot of small changes continuously, try using the `grunt watch` command.

Let this command run in your terminal, and whenever you change a file, your files will automagically rebuild :tada:.



## TODO
* [Required Reading](http://bost.ocks.org/mike/chart/)
* Outline Scope
* Create Examples


# THIS IS THE OLD README AS A REMINDER...

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
  var charty = d3(selector).datum(data).call(charter);
  // or this
  var charty = d5(selector).datum(data).update(charter);
  // or this
  var charty = d5(selector, data).update(charter);
  // or even this
  var charty = d5(selector, data, charter);

```

## what's included

**TODO**
:grin: