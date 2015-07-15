'use strict';

import {IJ} from '../common';

/* Image to test:
0011
1111
1100
0000
 */



describe('we check that each ROI is surrounded by the expect zones', function () {
    var data=new Uint8Array(2);
    data[0]=63;
    data[1]=192;

    var mask=new IJ(4,4, data, {
        kind: 'BINARY'
    });

    var roiManager=mask.getROIManager();
    roiManager.putMask(mask);

    var result=roiManager.getROI();
    result.should.have.lengthOf(3);

    result[0].surround.should.eql([1]);
    result[1].surround.should.eql([1]);
    result[2].surround.should.eql([-1,-2]);

});

