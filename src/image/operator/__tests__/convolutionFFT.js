import {Image, getHash} from 'test/common';

describe('check the convolutionFFT operator', function () {
    it('check the convolution for GREY image', function () {
        let image = new Image(4, 4,
            [
                1, 1, 1, 1,
                1, 2, 2, 1,
                1, 2, 2, 1,
                1, 1, 1, 1
            ],
            {kind: 'GREY'}
        );

        Array.from(image.convolutionFFT([1, 1, 1, 1, 1, 1, 1, 1, 1]).data).should.eql(
            [
                13, 13, 13, 13,
                13, 13, 13, 13,
                13, 13, 13, 13,
                13, 13, 13, 13
            ]
        );
    });
});

