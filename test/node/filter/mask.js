import {Image} from '../common';

describe('Create a mask from a greyA image', function () {

    let image = new Image(4,1,[255, 255, 0, 255, 255, 0, 0, 0], {
        kind: 'GREYA'
    });

    it('should create a mask for a threshold of 0.5 using alpha channel', function () {
        let mask=image.mask(0.5);

        mask.channels.should.equal(1);
        mask.bitDepth.should.equal(1);
        mask.width.should.equal(4);
        mask.height.should.equal(1);

        let data=mask.data;
        data.should.instanceOf(Uint8Array);
        data.length.should.equal(1);

        data[0].should.equal(128);
    });

    it('should create a mask for a threshold of 0.5 not using alpha channel', function () {
        let mask=image.mask(0.5, {useAlpha: false});

        mask.channels.should.equal(1);
        mask.bitDepth.should.equal(1);
        mask.width.should.equal(4);
        mask.height.should.equal(1);

        let data=mask.data;
        data.should.instanceOf(Uint8Array);
        data.length.should.equal(1);

        data[0].should.equal(0b10100000);
    });

});

describe('Create a mask from a greyA image using percentile algorithm', function () {

    it('should give the right result', function() {
        let image = new Image(4,1,[0, 255, 63, 255, 127, 255, 255, 255], {
            kind: 'GREYA'
        });

        let mask=image.mask('percentile', {useAlpha: false});

        mask.channels.should.equal(1);
        mask.bitDepth.should.equal(1);
        mask.width.should.equal(4);
        mask.height.should.equal(1);

        let data=mask.data;
        data.should.instanceOf(Uint8Array);
        data.length.should.equal(1);

        data[0].should.equal(240);
    });
});
