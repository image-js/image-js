'use strict';

var Benchmark = require('benchmark');
var Image = require('..');
var Test = require('ij-test');

var suite = new Benchmark.Suite;



Image.load(Test.getImage('rgb8.png')).then(function (img) {
    var mask=img.split()[0].mask();

    suite
        .add('invert', function () {
            mask.invert();
        })
        .add('invertBinaryLoop', function () {
            mask.invertBinaryLoop();
        })
        .on('cycle', function (event) {
            console.log(String(event.target));
        })
        .on('complete', function () {
            console.log('Fastest is ' + this.filter('fastest').pluck('name'));
        })
        .run();

});
