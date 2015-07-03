'use strict';

var Benchmark = require('benchmark');
var IJ = require('..');
var Test = require('ij-test');

var suite = new Benchmark.Suite;

IJ.load(Test.getImage('rgb8.png')).then(function (img) {

    suite
        .add('invert', function () {
            img.invert();
        })
        .add('invertMatrix', function () {
            img.invertMatrix();
        })
        .add('invertGetterSetter', function () {
            img.invertGetterSetter();
        })
        .on('cycle', function (event) {
            console.log(String(event.target));
        })
        .on('complete', function () {
            console.log('Fastest is ' + this.filter('fastest').pluck('name'));
        })
        .run();

});
