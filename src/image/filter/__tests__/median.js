import {Image} from '../../../../test/node/common';

describe('check the medianFilter filter', function () {
    it('check for GREY image', function () {
        let image = new Image(5, 5,
            [
                1, 2, 3, 4, 5,
                1, 2, 3, 4, 5,
                1, 2, 3, 4, 5,
                1, 2, 3, 4, 5,
                1, 2, 3, 4, 5
            ],
            {kind: 'GREY'}
        );

        Array.from(image.gaussianFilter().data).should.eql(
            [
                2, 2, 3, 4, 4,
                2, 2, 3, 4, 4,
                2, 2, 3, 4, 4,
                2, 2, 3, 4, 4,
                2, 2, 3, 4, 4
            ]
        );
    });
});

