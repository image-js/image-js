'use strict';

import {Image} from '../common';

describe('Create a mask from a greyA image', function () {

    let image = new Image(4,1,[255, 255, 0, 255, 255, 0, 0, 0], {
        kind: 'GREYA'
    });

    it('should create a mask for a threshold of 0.5 using alpha channel', function () {
        var mask=image.mask(0.5);

        mask.channels.should.equal(1);
        mask.bitDepth.should.equal(1);
        mask.width.should.equal(4);
        mask.height.should.equal(1);

        var data=mask.data;
        data.should.instanceOf(Uint8Array);
        data.length.should.equal(1);

        data[0].should.equal(128);
    });

    it('should create a mask for a threshold of 0.5 not using alpha channel', function () {
        var mask=image.mask(0.5, {useAlpha: false});

        mask.channels.should.equal(1);
        mask.bitDepth.should.equal(1);
        mask.width.should.equal(4);
        mask.height.should.equal(1);

        var data=mask.data;
        data.should.instanceOf(Uint8Array);
        data.length.should.equal(1);

        data[0].should.equal(0b10100000);
    });

});

describe('Create a mask from a greyA image using percentile algorithm', function () {

    var image = new Image(4,1,[0, 255, 63, 255, 127, 255, 255, 255], {
        kind: 'GREYA'
    });

    var mask=image.mask('percentile', {useAlpha: false});

    mask.channels.should.equal(1);
    mask.bitDepth.should.equal(1);
    mask.width.should.equal(4);
    mask.height.should.equal(1);

    var data=mask.data;
    data.should.instanceOf(Uint8Array);
    data.length.should.equal(1);

    data[0].should.equal(240);


});
