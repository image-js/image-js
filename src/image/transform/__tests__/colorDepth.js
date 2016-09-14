import {Image} from 'test/common';

describe('check the colorDepth transform', function () {
    it('check the right colorDepth for GREY image 8 bit', function () {

        let image = new Image(4, 1,
            [
                0x00, 0x7f, 0xff, 0x12
            ],
            {kind: 'GREY'}
        );

        let newImage = image.colorDepth(8);
        Array.from(newImage.data).should.eql([0x00, 0x7f, 0xff, 0x12]);

        newImage = image.colorDepth(16);
        Array.from(newImage.data).should.eql([0x0000, 0x7f7f, 0xffff, 0x1212]);
    });

    it('check the right colorDepth for GREY image 8 bit', function () {

        let image = new Image(4, 1,
            [
                0x0000, 0x7fff, 0xffff, 0x1234
            ],
            {kind: 'GREY', bitDepth: 16}
        );


        let newImage = image.colorDepth(8);
        Array.from(newImage.data).should.eql([0x00, 0x7f, 0xff, 0x12]);

        newImage = image.colorDepth(16);
        Array.from(newImage.data).should.eql([0x0000, 0x7fff, 0xffff, 0x1234]);

        (function () {
            image.colorDepth(15);
        }).should.throw(/You need to specify the new colorDepth as 8 or 16/);

    });

});
