'use strict';

var IJ = require('../..');

var data=new Uint8Array(2);
data[0]=255;
data[1]=0;

var img=new IJ(4,4, data, {
    kind: 'BINARY'
});


var data=new Uint8Array(1);
data[0]=192;

var img=new IJ(2,2, data, {
    kind: 'BINARY'
});


var pixels=img.mark();

console.log(pixels);
