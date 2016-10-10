'use strict';

var Benchmark = require('benchmark');
var Image = require('..');
var Test = require('../test/test');

var suite = new Benchmark.Suite;

var filename='cells/cells.jpg';


// TODO Order of testing is EXTREMELY important !!!!!
// So basically this test is really useless ...

Image.load(Test.getImage(filename)).then(function (img) {
    var grey = img.grey();
    let mask = grey.mask({threshold: 50});
    let manager = img.getRoiManager();


    suite
        .add('fromMask2', function () {
            manager.fromMask(mask);
        })
        .add('fromMask', function () {
            manager.fromMask2(mask);
        })

        .on('cycle', function (event) {
            console.log(String(event.target));
        })
        .on('complete', function () {
            console.log('Fastest is ' + this.filter('fastest').map('name'));
        })
        .run();

}).catch(console.error);
