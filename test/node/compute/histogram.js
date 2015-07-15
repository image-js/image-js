'use strict';

import {Image} from '../common';

describe('calculate the histogram', function () {
    it('check getHistogram method', function () {

        let image = new Image(1,2,[230, 83, 120, 255, 100, 140, 13, 1]);

        let histogram=image.getHistogram({useAlpha: false, channel: 0});
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


    it('check histogram property', function () {

        let image = new Image(1,4,[230, 255, 230, 255, 230, 255, 13, 1], {
            kind:'GREYA'
        });

        let histogram=image.histogram;

        histogram[0].should.equal(1);
        histogram[230].should.equal(3);
        histogram[100].should.equal(0);
        histogram[255].should.equal(0);
    });

    it('check 16 slots histogram', function () {

        let image = new Image(1,4,[230, 255, 230, 255, 230, 255, 13, 1], {
            kind:'GREYA'
        });

        let histogram=image.getHistogram({maxSlots: 16});

        histogram[0].should.equal(1);
        histogram[14].should.equal(3);
        histogram[1].should.equal(0);
        histogram[15].should.equal(0);
    });

});

