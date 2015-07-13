'use strict';

import {IJ} from '../common';

describe('calculate the histogram', function () {
    it('check histogram property', function () {

        let image = new IJ(1,2,[230, 83, 120, 255, 100, 140, 13, 1]);


        let histogram=image.histogram;
        histogram[0].should.equal(1);
        histogram[230].should.equal(1);
        histogram[100].should.equal(0);
        histogram[255].should.equal(0);

        histogram=image.getHistogram({useAlpha: false});
        histogram[0].should.equal(0);
        histogram[100].should.equal(1);
        histogram[230].should.equal(1);
        histogram[255].should.equal(0);

        histogram=image.getHistogram({useAlpha: false, channel: 2});
        histogram[0].should.equal(0);
        histogram[13].should.equal(1);
        histogram[120].should.equal(1);
        histogram[255].should.equal(0);


    });
});

