'use strict';

var Benchmark = require('benchmark');
var Image = require('..');
var Test = require('../test/test');

var suite = new Benchmark.Suite;

var filename='cells/cells.jpg';
//filename='ecoli.png';
// filename='cat.jpg';

Image.load(Test.getImage(filename)).then(function (img) {
    suite
        .add('red', function () {
            img.grey({algorithm:'lightness'});
        })
        .add('grey', function () {
            img.grey({algorithm:'luma709'});
        })
        .add('grey callback', function () {
            img.grey({algorithm:'luma709callback'});
        })
        .add('grey lightness', function () {
            img.grey({algorithm:'lightness'});
        })
        .on('cycle', function (event) {
            console.log(String(event.target));
        })
        .on('complete', function () {
            console.log('Fastest is ' + this.filter('fastest').map('name'));
        })
        .run();

}).catch(console.error);
