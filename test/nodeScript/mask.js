'use strict';

var IJ = require('../..');



var image = new IJ(4,1,[255, 255, 0, 255, 255, 0, 0, 0], {
    kind: 'GREYA'
});

var mask=image.mask({useAlpha: false});

console.log(mask);
console.log(mask.data);
