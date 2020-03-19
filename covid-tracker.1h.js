#!/usr/bin/env /usr/local/bin/node

//<bitbar.title>COVID-19 Tracker</bitbar.title>
//<bitbar.version>v1.0</bitbar.version>
//<bitbar.author>victor</bitbar.author>
//<bitbar.author.github>elalemanyo</bitbar.author.github>
//<bitbar.desc>Track number of corona virus cases from your status bar</bitbar.desc>
//<bitbar.dependencies>node</bitbar.dependencies>
//<bitbar.image></bitbar.image>
//<bitbar.abouturl>https://github.com/elalemanyo/bitbar-covid-19-tracker/README.md</bitbar.abouturl>

const https = require('https');
const urls = [
  "https://coronavirus-tracker-api.herokuapp.com/v2/latest",
  "https://coronavirus-tracker-api.herokuapp.com/v2/locations/11",
  "https://coronavirus-tracker-api.herokuapp.com/v2/locations/18",
];

https.get(urls[0], res => {
    let data = '';
    res.on('data', chunk => {
      data += chunk;
    });
    res.on('end', () => {
      let apiData = JSON.parse(data);
      let icon = 'iVBORw0KGgoAAAANSUhEUgAAABIAAAASCAYAAAEhyb7BAAAAAXNSR0IArs4c6QAAAdlJREFUOBGFkzFLHFEQgFeFeBowalAJnB4kIFpIuN+QcEmRziJ10mhpGkGwtEkgfQqv8RdYCkqKgHiNZcQmVa46MCoREaIx3/d8b9nDjQ58O/PmzZudfTObZTfySNUDGp+gAkE2kqFu9PG4ho6xz+BcI4k7U/BARwOq8BnceAJdUiuullkYlY1E4yw59P6G1xCOPMZoQak8xGuKv+DJTfBAEDeVY3BzAUx9CXlGT1qNm6kI3+2BIBZhWh1/otbW/x5KZRhvs3QnOivoCzCTJQTpTUbUH9D9MAhfIQ/EzpZgDn7ARzCT3VGHVy9i7EWHzqfRfht1HZ2NxsU4ej3a81G/QwdZ4WmGL3AAY3AEv2AWgpzyNKhIm/XLsFt4GGjG57AKtwLw3Sl+2DZY+y6YzOE0cd587P+KV/cTirdzxbpYui03YQ1KZQiv978GHvwG3uIheFGTkBJaoT9ILrbfCtwwgU1MwQamVnzHnijseWdBHDDvIM1QqsBJMIHN3gf9HbBlW3HdQnvxbyCMipdooHcwAH5CqiYlcCimwb7ra8MJvIBc7IJDasAOVMGZ9BMcu1SB+w6Pf2ZXAtZBUhvtQkrooYSf4HhawQzcK7UY8QrdjHYdHe4grkvVP0xXjBIOIZS9AAAAAElFTkSuQmCC';
      printBitBarLine(formatNumber(apiData.latest.confirmed), ['color=red', 'templateImage=' + icon]);

      printBitBarLine('---')

      printBitBarLine('Confirmed: ' + formatNumber(apiData.latest.confirmed), ['color=red']);
      printBitBarLine('Deaths: ' + formatNumber(apiData.latest.deaths), ['color=#000000']);
      printBitBarLine('Recovered: ' + formatNumber(apiData.latest.recovered), ['color=#61B329']);

      printBitBarLine('---');

      printBitBarLine("Dashboard", ['href=https://www.arcgis.com/apps/opsdashboard/index.html#/bda7594740fd40299423467b48e9ecf6']);
      printBitBarLine('Source', ['href=https://github.com/CSSEGISandData/COVID-19']);
    });
  })
  .on('error', err => {
    console.log('Error: ' + err.message);
  });

function formatNumber(number) {
  return number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.');
}

function printBitBarLine(title, args) {
  let lineArgs = [];

  for (let i in args) {
    lineArgs.push(args[i]);
  }

  console.log((lineArgs.length !== 0)? title + '|' + lineArgs.join(' ') : title);
}
