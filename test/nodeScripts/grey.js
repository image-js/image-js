'use strict';

/*
 Execute this script with:
 node -r esm invert.js
*/

let { Image } = require('../../src');

let image = new Image(1, 2, [230, 83, 120, 255, 100, 140, 13, 240]);

image.invert();

console.log(image);
