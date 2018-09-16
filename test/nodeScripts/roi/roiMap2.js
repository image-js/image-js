'use strict';

let { Image } = require('../../../src');

Image.load('./test/img/moon/nocrop/BloodMoonTest-6.png')
  .then(function (img) {
    img = img.resize({ factor: 4 });
    let roiManager = img.getRoiManager();
    let mask = img.grey().mask();

    console.time('mask1');
    roiManager.fromMask(mask, { label: 'mask1' });
    console.timeEnd('mask1');

    console.time('mask2');
    roiManager.fromMask2(mask, { label: 'mask2', neighbours: 4 });
    console.timeEnd('mask2');
  })
  .catch(console.error);
