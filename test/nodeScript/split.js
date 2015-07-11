'use strict';

var IJ = require('../..');


var image = new IJ(1,2,[230, 83, 120, 255, 100, 140, 13, 240]);
var images=image.split();


console.log(images);

console.log(images.length);
