import {Image} from '../common';

/* Image to test:
0011
1111
1100
0000
 */



describe('we check that each ROI is surrounded by the expect zones', function () {
    let data=new Uint8Array(2);
    data[0]=63;
    data[1]=192;

    let mask=new Image(4,4, data, {
        kind: 'BINARY'
    });

    let roiManager=mask.getROIManager();
    roiManager.putMask(mask);

    it('should yield the right result', function () {
        let result=roiManager.getROI();
        result.should.have.lengthOf(3);

        result[0].surround.should.eql([1]);
        result[1].surround.should.eql([1]);
        result[2].surround.should.eql([-1,-2]);
    });
});
