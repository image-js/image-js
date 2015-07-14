'use strict';

var IJ = require('../../../lib/ij.js');

var data=new Uint8Array(2);
data[0]=63;
data[1]=192;

var mask=new IJ(4,4, data, {
    kind: 'BINARY'
});


var roiManager=mask.getROIManager();
roiManager.putMask(mask);
var rois=roiManager.getROI();

console.log(rois);

console.log(roiManager.getPixels());