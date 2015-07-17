'use strict';

var Image = require('../../..');

Image.load('./node_modules/ij-test/img/BW15x15.png').then(function (img) {
    console.log('Width: ',img.width);
    console.log('Height: ',img.height);
    var roiManager=img.getROIManager();
    var mask=img.grey().mask();
    roiManager.putMask(mask);
    var rois=roiManager.getROI();
    for (var i=0; i<rois.length; i++) {
        var roi=rois[i];
        console.log("ROI ID:",roi.id,
            ' surface:', roi.surface,
            ' boxPixels:', roi.boxPixels,
            ' contour:', roi.contour,
            ' border:', roi.border)
    }
  //  console.log(rois);

});
