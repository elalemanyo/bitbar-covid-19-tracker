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
const baseUrl = 'https://coronavirus-tracker-api.herokuapp.com';
const urls = [
    '/v2/latest',
    '/v2/locations/154',
    '/v2/locations/16',
    '/v2/locations/11',
    '/v2/locations/18'
];

const icon = 'iVBORw0KGgoAAAANSUhEUgAAABIAAAASCAYAAAEhyb7BAAAAAXNSR0IArs4c6QAAAdlJREFUOBGFkzFLHFEQgFeFeBowalAJnB4kIFpIuN+QcEmRziJ10mhpGkGwtEkgfQqv8RdYCkqKgHiNZcQmVa46MCoREaIx3/d8b9nDjQ58O/PmzZudfTObZTfySNUDGp+gAkE2kqFu9PG4ho6xz+BcI4k7U/BARwOq8BnceAJdUiuullkYlY1E4yw59P6G1xCOPMZoQak8xGuKv+DJTfBAEDeVY3BzAUx9CXlGT1qNm6kI3+2BIBZhWh1/otbW/x5KZRhvs3QnOivoCzCTJQTpTUbUH9D9MAhfIQ/EzpZgDn7ARzCT3VGHVy9i7EWHzqfRfht1HZ2NxsU4ej3a81G/QwdZ4WmGL3AAY3AEv2AWgpzyNKhIm/XLsFt4GGjG57AKtwLw3Sl+2DZY+y6YzOE0cd587P+KV/cTirdzxbpYui03YQ1KZQiv978GHvwG3uIheFGTkBJaoT9ILrbfCtwwgU1MwQamVnzHnijseWdBHDDvIM1QqsBJMIHN3gf9HbBlW3HdQnvxbyCMipdooHcwAH5CqiYlcCimwb7ra8MJvIBc7IJDasAOVMGZ9BMcu1SB+w6Pf2ZXAtZBUhvtQkrooYSf4HhawQzcK7UY8QrdjHYdHe4grkvVP0xXjBIOIZS9AAAAAElFTkSuQmCC';

let responses = {},
    completed_requests = 0,
    urlsLength = urls.length;

for (let i = 0; i < urlsLength; i++) {
    https.get(baseUrl + urls[i], function(res) {
        let data = '';
        res.on('data', chunk => {
            data += chunk;
        });
        res.on('end', () => {
            responses[i] = JSON.parse(data);
            completed_requests++;
            if (completed_requests == urls.length) {
                renderBitBarOutput(responses);
            }
        });
    }).on('error', (e) => {
        // console.log('Error: ' + e.message);
    });
}

function renderBitBarOutput(responses) {
    if (Object.keys(responses).length == 0) {
        printBitBarLine('⚠️', ['templateImage=' + icon]);
    }

    else {
        printBitBarLine(formatNumber(responses[0].latest.confirmed), ['templateImage=' + icon]);

        printBitBarLine('---')

        printBitBarLine('Confirmed: ' + formatNumber(responses[0].latest.confirmed), ['color=red']);
        printBitBarLine('Deaths: ' + formatNumber(responses[0].latest.deaths), ['color=#000000']);
        printBitBarLine('Recovered: ' + formatNumber(responses[0].latest.recovered), ['color=#61B329']);

        printBitBarLine('---');

        renderCountriesSubmenus(responses);
    }

    renderFooter();

};

function renderCountriesSubmenus(responses) {
    let keys = Object.keys(responses),
        country;

    keys.shift();
    for (let key of keys) {
        country = responses[key].location;
        printBitBarLine(country.country + ' (' + formatNumber(country.latest.confirmed) + ')');

        printBitBarLine('--Confirmed: ' + formatNumber(country.latest.confirmed), ['color=red']);
        printBitBarLine('--Deaths: ' + formatNumber(country.latest.deaths), ['color=#000000']);
        printBitBarLine('--Recovered: ' + formatNumber(country.latest.recovered), ['color=#61B329']);
    }
};

function renderFooter() {
    printBitBarLine('---');

    printBitBarLine('Dashboard', ['href=https://www.arcgis.com/apps/opsdashboard/index.html#/bda7594740fd40299423467b48e9ecf6']);
    printBitBarLine('Source', ['href=https://github.com/CSSEGISandData/COVID-19']);
}

function formatNumber(number) {
    return number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.');
};

function printBitBarLine(title, args) {
    let lineArgs = [];

    for (let i in args) {
        lineArgs.push(args[i]);
    }

    console.log((lineArgs.length !== 0)? title + '|' + lineArgs.join(' ') : title);
};
