'use strict';

var Benchmark = require('benchmark');
var Image = require('..');
var Test = require('ij-test');

var suite = new Benchmark.Suite;

var filename='cells.jpg';
//filename='ecoli.png';
// filename='cat.jpg';

Image.load(Test.getImage(filename)).then(function (img) {
    suite
        .add('invert', function () {
            img.invert();
        })
        .add('invertOneLoop', function () {
            img.invertOneLoop();
        })
        /*
         .add('invertMatrix', function () {
         img.invertMatrix();
         })
        .add('invertIterator', function () {
            img.invertIterator();
        })
         */
        .add('invertApply', function () {
            img.invertApply();
        })
        .add('invertPixel', function () {
            img.invertPixel();
        })
        .on('cycle', function (event) {
            console.log(String(event.target));
        })
        .on('complete', function () {
            console.log('Fastest is ' + this.filter('fastest').pluck('name'));
        })
        .run();

});
