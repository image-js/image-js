'use strict';

var IJ = require('../..');

var img=new IJ(16,1,{
    kind: 'BINARY'
});


img.setBit(15,0);
img.setBit(1,0);

console.log(img.getBit(0,0),img.getBit(1,0),img.getBit(15,0));

img.toggleBit(1,0);
img.toggleBit(0,0);

console.log(img.getBit(0,0),img.getBit(1,0),img.getBit(15,0));

img.clearBit(15,0);
img.clearBit(1,0);

console.log(img.data);

