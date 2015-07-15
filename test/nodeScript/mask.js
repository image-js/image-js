'use strict';

var Image = require('../..');



var image = new Image(4,1,[0, 255, 63, 255, 127, 255, 255, 255], {
    kind: 'GREYA'
});


// var mask=image.mask(127, {useAlpha: true});


var mask=image.mask('percentile', {useAlpha: true});


console.log(mask);
