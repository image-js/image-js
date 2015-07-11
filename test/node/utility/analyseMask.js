'use strict';

import {IJ} from '../common';

describe('mark a binary image 2 x 2', function () {

    var data=new Uint8Array(1);
    data[0]=192;

    var img=new IJ(2,2, data, {
        kind: 'BINARY'
    });

    var result=img.analyseMask();
    var pixels=result.pixels;

    it('should have 4 pixels in 2 zones', function () {
        pixels.should.instanceOf(Int16Array).and.have.lengthOf(4);;
        pixels[0].should.equal(1);
        pixels[1].should.equal(1);
        pixels[2].should.equal(-1);
        pixels[3].should.equal(-1);
    });

    it('should have 2 zones, one positive, one negative', function () {
        result.total.should.equal(2);
        result.negative.should.equal(1);
        result.positive.should.equal(1);
    });

});
