'use strict';

let Benchmark = require('benchmark');

let Image = require('..');

let Test = require('../test/test');

let suite = new Benchmark.Suite();

let filename = 'cells/cells.jpg';
// filename='ecoli.png';
// filename='cat.jpg';

Image.load(Test.getImage(filename)).then(function (img) {
  suite
    .add('invert', function () {
      img.invert();
    })
    .add('invertOneLoop', function () {
      img.invertOneLoop();
    })
  /* .add('invertIterator', function () {
            img.invertIterator();
        })
         */
    .add('invertApply', function () {
      img.invertApply();
    })
    .add('invertApplyAll', function () {
      img.invertApplyAll();
    })
    .add('invertPixel', function () {
      img.invertPixel();
    })
    .on('cycle', function (event) {
      console.log(String(event.target));
    })
    .on('complete', function () {
      console.log(`Fastest is ${this.filter('fastest').map('name')}`);
    })
    .run();
}).catch(console.error);
