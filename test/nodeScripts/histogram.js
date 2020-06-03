'use strict';

/*
 Execute this script with:
 node -r esm histogram.js
*/

let { Image } = require('../../src');

// let image = new Image(1,2,[230, 83, 120, 255, 100, 140, 13, 1]);

let image = new Image(1, 4, [230, 255, 230, 255, 230, 255, 13, 1], {
  kind: 'GREYA',
});

let histogram = image.getHistogram({
  maxSlots: 16,
  channel: 0,
  useAlpha: true,
});

console.log(histogram);
