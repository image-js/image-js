'use strict';

var Benchmark = require('benchmark');
var Image = require('..');
var Test = require('ij-test');

var suite = new Benchmark.Suite;

Image.load(Test.getImage('rgb8.png')).then(function (img) {
    suite
        .add('invert', function () {
            img.invert();
        })
        .add('invertMatrix', function () {
            img.invertMatrix();
        })
        .add('invertOneLoop', function () {
            img.invertOneLoop();
        })
        .on('cycle', function (event) {
            console.log(String(event.target));
        })
        .on('complete', function () {
            console.log('Fastest is ' + this.filter('fastest').pluck('name'));
        })
        .run();

});
