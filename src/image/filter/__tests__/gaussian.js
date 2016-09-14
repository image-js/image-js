import {Image} from 'test/common';

describe('check the gaussianFilter filter', function () {
    it('check for GREY image', function () {
        let image = new Image(5, 5,
            [
                10, 10, 10, 10, 10,
                10, 20, 20, 20, 10,
                10, 20, 30, 20, 10,
                10, 20, 20, 20, 10,
                10, 10, 10, 10, 10
            ],
            {kind: 'GREY'}
        );

        Array.from(image.gaussianFilter().data).should.eql(
            [
                15, 15, 17, 15, 15,
                15, 15, 17, 15, 15,
                17, 17, 21, 17, 17,
                15, 15, 17, 15, 15,
                15, 15, 17, 15, 15
            ]
        );

    });


});

