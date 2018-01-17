import { Image } from 'test/common';
import 'should';

describe('check the convolutionFft operator', function () {
    it('check the convolution for GREY image', function () {
        let image = new Image(4, 4,
            [
                1, 1, 1, 1,
                1, 2, 2, 1,
                1, 2, 2, 1,
                1, 1, 1, 1
            ],
            { kind: 'GREY' }
        );

        Array.from(image.convolutionFft([1, 1, 1, 1, 1, 1, 1, 1, 1]).data).should.eql(
            [
                13, 13, 13, 13,
                13, 13, 13, 13,
                13, 13, 13, 13,
                13, 13, 13, 13
            ]
        );
    });
});

