import {Image, load} from '../common';

/* Image to test:
0011
1111
1100
0000
 */

load('BW11x11.png').then(function (img) {

    describe('we check that each ROI is surrounded by the expect zones', function () {

        img.width.should.equal(11);
        img.height.should.equal(11);

        let roiManager=img.getROIManager();
        let mask=img.grey().mask();
        roiManager.putMask(mask);

        let rois=roiManager.getROI();

        rois.instanceof.array.and.of.size(4);

        rois[0].should.containEql({surround: [1], surface:1, boxPixels: 1, contour: 1, border: 1});
        rois[1].should.containEql({surround: [1], surface:72, boxPixels: 32, contour: 32, border: 44});
        rois[2].should.containEql({surround: [-2], surface:39, boxPixels: 39, contour: 39, border: 39});
        rois[3].should.containEql({surround: [-1], surface:9, boxPixels: 8, contour: 8, border: 8});

    });
});
