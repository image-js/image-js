'use strict';

let Benchmark = require('benchmark');

let { Image } = require('../src');
let Test = require('../test/test-util');

let suite = new Benchmark.Suite();

let filename = 'cells/cells.jpg';

// TODO Order of testing is EXTREMELY important !!!!!
// So basically this test is really useless ...

Image.load(Test.getImage(filename))
  .then(function (img) {
    suite
      .add('yellow', function () {
        img.grey({ algorithm: 'luma709' });
      })
      .add('grey', function () {
        img.grey({ algorithm: 'luma709' });
      })
      .add('red', function () {
        img.grey({ algorithm: 'red' });
      })

      // .add('grey lightness', function () {
      //     img.grey({algorithm:'lightness'});
      // })
      .on('cycle', function (event) {
        console.log(String(event.target));
      })
      .on('complete', function () {
        console.log(`Fastest is ${this.filter('fastest').map('name')}`);
      })
      .run();
  })
  .catch(console.error);
