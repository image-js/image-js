'use strict';

const path = require('path');

const Benchmark = require('benchmark');

const Image = require('..').default;

const suite = new Benchmark.Suite();

const filename = 'cells/cells.jpg';

Image.load(path.join(__dirname, '../test/img', filename))
  .then(function (img) {
    img = img.resize({ factor: 0.25 });
    suite
      .add('direct', function () {
        img.gaussianFilter({ algorithm: 'direct', radius: 17 });
      })
      .add('fft', function () {
        img.gaussianFilter({ algorithm: 'fft', radius: 17 });
      })
      .add('separable', function () {
        img.gaussianFilter({ algorithm: 'separable', radius: 17 });
      })
      .on('cycle', function (event) {
        console.log(String(event.target));
      })
      .on('complete', function () {
        console.log(`Fastest is ${this.filter('fastest').map('name')}`);
      })
      .run();
  })
  .catch(console.error);
