import {Image} from '../common';

/* Image to test:
0011
1111
1100
0100
 */



describe('Get the maxLength of the ROI and the points', function () {
    let data = new Uint8Array(2);
    data[0] = 63;
    data[1] = 196;

    let mask = new Image(4,4, data, {
        kind: 'BINARY'
    });

    let roiManager = mask.getROIManager();
    roiManager.putMask(mask);

    it('maxLengthPoints', function () {
        let result = roiManager.getROI();
        result[0].maxLengthPoints.x1.should.equal(3);
        result[0].maxLengthPoints.y1.should.equal(0);
        result[0].maxLengthPoints.x2.should.equal(1);
        result[0].maxLengthPoints.y2.should.equal(3);
    });

    it('maxLength', function () {
        let result = roiManager.getROI();
        result[0].maxLength.should.equal(Math.sqrt(13));
    });
});
