'use strict';

import {IJ} from '../common';


describe('mark a binary image 4 x 4 in 3 zones and create ROIs', function () {
    var data=new Uint8Array(2);
    data[0]=63;
    data[1]=192;

    var img=new IJ(4,4, data, {
        kind: 'BINARY'
    });

    var result=img.createROIs(img.analyseMask());

    var expected=[ { minX: 0, maxX: 3, minY: 2, maxY: 3, surface: 6 },
        { minX: 0, maxX: 1, minY: 0, maxY: 0, surface: 2 },
        { minX: 0, maxX: 3, minY: 0, maxY: 2, surface: 8 } ];

    result.should.eql(expected);
});