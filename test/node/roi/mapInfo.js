'use strict';

import {IJ} from '../common';

/* Image to test:
0011
1111
1100
0000
 */



describe.skip('mark a binary image 4 x 4 in 3 zones and create ROIs', function () {
    var data=new Uint8Array(2);
    data[0]=63;
    data[1]=192;

    var mask=new IJ(4,4, data, {
        kind: 'BINARY'
    });

    var roiManager=mask.getROIManager();
    roiManager.putMask(mask);


    var result=roiManager.getROI();

    var expected=[ { id: -2, meanX:  1.8333333333333333, meanY: 2.6666666666666665, minX: 0, maxX: 3, minY: 2, maxY: 3, surface: 6 },
        { id: -1, meanX: 0.5, meanY: 0, minX: 0, maxX: 1, minY: 0, maxY: 0, surface: 2 },
        { id: 1, meanX: 1.5, meanY: 1, minX: 0, maxX: 3, minY: 0, maxY: 2, surface: 8 } ];

    result.should.eql(expected);
});

