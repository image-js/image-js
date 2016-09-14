import {Image} from 'test/common';

describe('check the gaussianFilter filter', function () {
    it('check for GREY image', function () {
        let image = new Image(7, 7,
            [
                0, 0, 0, 0, 0, 0, 0,
                0, 0, 0, 0, 0, 0, 0,
                0, 0, 9, 9, 9, 0, 0,
                0, 0, 9, 0, 9, 0, 0,
                0, 0, 9, 9, 9, 0, 0,
                0, 0, 0, 0, 0, 0, 0,
                0, 0, 0, 0, 0, 0, 0
            ],
            {kind: 'GREY'}
        );

        Array.from(image.sobelFilter().data).should.eql(
            [
                13, 13, 28, 36, 28, 13, 13,
                13, 13, 28, 36, 28, 13, 13,
                28, 28, 25, 18, 25, 28, 28,
                36, 36, 18, 0, 18, 36, 36,
                28, 28, 25, 18, 25, 28, 28,
                13, 13, 28, 36, 28, 13, 13,
                13, 13, 28, 36, 28, 13, 13


            ]
        );
    });


});

