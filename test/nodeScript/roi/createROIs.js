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

for (var i=0; i<rois.length; i++) {
    console.log("ROIs width and height: ",rois[i].width, rois[i].height)
}


for (var i=0; i<rois.length; i++) {
    console.log("ROI ID and surrounding ids: ",rois[i].id, rois[i].surround)
}



//console.log(rois);

