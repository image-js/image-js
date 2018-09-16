'use strict';

let Image = require('../..');


let image = new Image(4, 1, [0, 255, 63, 255, 127, 255, 255, 255], {
  kind: 'GREYA'
});


// var mask=image.mask(127, {useAlpha: true});


let mask = image.mask('percentile', { useAlpha: true });


console.log(mask);
