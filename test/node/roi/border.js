import {Image, load} from '../common';

/* Image to test:
0011
1111
1100
0000
 */

load('./node_modules/ij-test/img/BW11x11.png').then(function (img) {

    describe('we check that each ROI is surrounded by the expect zones', function () {

        img.width.should.equal(11);
        img.height.should.equal(11);

        let roiManager=img.getROIManager();
        let mask=img.grey().mask();
        roiManager.putMask(mask);
        let rois=roiManager.getROI();
        for (let i=0; i<rois.length; i++) {
            let roi=rois[i];
            console.log("ROI ID:",roi.id,
                ' surround:', roi.surround,
                ' surface:', roi.surface,
                ' boxPixels:', roi.boxPixels,
                ' contour:', roi.contour,
                ' border:', roi.border)
        }
    });
});
