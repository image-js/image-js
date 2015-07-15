'use strict';

var Image = require('../..');


var image = new Image(1,2,[230, 83, 120, 255, 100, 140, 13, 240]);
var images=image.split();


console.log(images);

console.log(images.length);
