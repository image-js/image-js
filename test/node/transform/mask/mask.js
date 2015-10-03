import {Image} from '../../common';

describe('Create mask from a GREY image', function () {
    it('From GREY image give a mask image', function () {
        let image = new Image(5, 1,
            [
                0, 63, 127, 191, 255
            ],
            {kind: 'GREY'}
        );

        image.mask().data[0].should.equal(0b00011000);
        image.mask({threshold: 0.9}).data[0].should.equal(0b00001000);
        image.mask({threshold: 128}).data[0].should.equal(0b00011000);
        image.mask({threshold: '50%'}).data[0].should.equal(0b00011000);
        image.mask({threshold: '50%', invert: true}).data[0].should.equal(0b11100000);
        image.mask({algorithm: 'percentile'}).data[0].should.equal(0b000111000);
        (function () {
            image.mask({algorithm: 'XXX'});
        }).should.throw(/mask transform unknown algorithm/);

    });
});

describe('Create a mask from a greyA image', function () {

    let image = new Image(4,1,[255, 255, 0, 255, 255, 0, 0, 0], {
        kind: 'GREYA'
    });


    it('should create a mask for a threshold of 0.5 using alpha channel', function () {
        let mask = image.mask({threshold: 0.5});

        mask.channels.should.equal(1);
        mask.bitDepth.should.equal(1);
        mask.width.should.equal(4);
        mask.height.should.equal(1);

        let data = mask.data;
        data.should.instanceOf(Uint8Array);
        data.length.should.equal(1);

        data[0].should.equal(176);
    });

    it('should create a mask for a threshold of 0.5 using alpha channel', function () {
        let mask = image.mask({invert: true});

        mask.channels.should.equal(1);
        mask.bitDepth.should.equal(1);
        mask.width.should.equal(4);
        mask.height.should.equal(1);

        let data = mask.data;
        data.should.instanceOf(Uint8Array);
        data.length.should.equal(1);

        data[0].should.equal(64);
    });

    it('should create a mask for a threshold of 0.5 not using alpha channel', function () {
        let mask = image.mask({useAlpha: false});

        mask.channels.should.equal(1);
        mask.bitDepth.should.equal(1);
        mask.width.should.equal(4);
        mask.height.should.equal(1);

        let data = mask.data;
        data.should.instanceOf(Uint8Array);
        data.length.should.equal(1);

        data[0].should.equal(0b10100000);
    });

});

describe('Create a mask from a greyA image using percentile algorithm', function () {

    it('should give the right result', function () {
        let image = new Image(4,1,[0, 255, 63, 255, 127, 255, 255, 255], {
            kind: 'GREYA'
        });

        let mask = image.mask({algorithm: 'percentile', useAlpha: false, invert: false});

        mask.channels.should.equal(1);
        mask.bitDepth.should.equal(1);
        mask.width.should.equal(4);
        mask.height.should.equal(1);

        let data = mask.data;
        data.should.instanceOf(Uint8Array);
        data.length.should.equal(1);

        console.log(data);

        data[0].should.equal(0b00110000);
    });
});
