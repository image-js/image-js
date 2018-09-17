'use strict';

/*
 Execute this script with:
 node -r esm split.js
*/

let { Image } = require('../../src');

let image = new Image(1, 2, [230, 83, 120, 255, 100, 140, 13, 240]);
let images = image.split();

console.log(images);

console.log(images.length);
