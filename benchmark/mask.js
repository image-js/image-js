'use strict';

let Benchmark = require('benchmark');

let Image = require('..');

let Test = require('../test/test');

let suite = new Benchmark.Suite();

let filename = 'cells/cells.jpg';


// TODO Order of testing is EXTREMELY important !!!!!
// So basically this test is really useless ...

Image.load(Test.getImage(filename)).then(function (img) {
  let grey = img.grey();
  let mask = grey.mask({ threshold: 50 });
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
      console.log(`Fastest is ${this.filter('fastest').map('name')}`);
    })
    .run();
}).catch(console.error);
