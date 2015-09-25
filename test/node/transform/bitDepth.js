import {Image} from '../common';

describe('check the bitDepth transform', function () {
    it('check the right bitDepth for GREY image 8 bit', function () {

        let image = new Image(3, 1,
            [
                0, 127, 255
            ],
            {kind: 'GREY'}
        );

        let newImage = image.bitDepth8();
        Array.from(newImage.data).should.eql([0, 127, 255]);

        newImage = image.bitDepth16();
        Array.from(newImage.data).should.eql([0, 32512, 65280]);
    });

    it('check the right bitDepth for GREY image 8 bit', function () {

        let image = new Image(3, 1,
            [
                0, 32767, 65535
            ],
            {kind: 'GREY', bitDepth: 16}
        );


        let newImage = image.bitDepth8();
        Array.from(newImage.data).should.eql([0, 127, 255]);

        newImage = image.bitDepth16();
        Array.from(newImage.data).should.eql([0, 32767, 65535]);
    });

});

