'use strict';

var IJ = require('../..');



var image = new IJ(4,1,[0, 255, 63, 255, 127, 255, 255, 255], {
    kind: 'GREYA'
});


// var mask=image.mask(127, {useAlpha: true});


var mask=image.mask('percentile', {useAlpha: true});


console.log(mask);
