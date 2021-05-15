'use strict';

let Benchmark = require('benchmark');

let Image = require('..');

let Test = require('../test/test');

let suite = new Benchmark.Suite();

Image.load(Test.getImage('rgb8.png')).then(function (img) {
  let mask = img.split()[0].mask();

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
      console.log(`Fastest is ${this.filter('fastest').pluck('name')}`);
    })
    .run();
});
