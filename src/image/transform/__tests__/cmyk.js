import {Image} from 'test/common';
import 'should';

describe('check the cmyk transform', function () {
    it('check the right result for RGB image 8 bit', function () {
        let image = new Image(2, 1,
            [
                100, 100, 0, 0, 100, 100
            ],
            {kind: 'RGB'}
        );

        let newImage = image.cmyk();

        newImage.colorModel.should.equal('CMYK');
        newImage.bitDepth.should.equal(8);

        Array.from(newImage.data).should.eql(
             [0, 0, 255, 155, 255, 0, 0, 155]
        );
    });

    it('check the right result for RGB A image 8 bit', function () {
        let image = new Image(2, 1,
            [
                16383, 16383, 0, 127, 0, 16383, 16383, 127
            ],
            {kind: 'RGBA', bitDepth: 16}
        );

        let newImage = image.cmyk();

        newImage.colorModel.should.equal('CMYK');
        newImage.bitDepth.should.equal(16);

        Array.from(newImage.data).should.eql(
            [0, 0, 65535, 49152, 127, 65535, 0, 0, 49152, 127]
        );
    });
});
