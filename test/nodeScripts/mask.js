'use strict';

/*
 Execute this script with:
 node -r esm mask.js
*/

let { Image } = require('../../src');

let image = new Image(4, 1, [0, 255, 63, 255, 127, 255, 255, 255], {
  kind: 'GREYA',
});

let mask = image.mask('percentile', { useAlpha: true });

console.log(mask);
