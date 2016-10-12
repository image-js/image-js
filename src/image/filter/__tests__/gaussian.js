import {Image} from 'test/common';

describe('check the gaussian filter', function () {
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

    it('check for GREY image wider than taller', function () {
        let image = new Image(7, 5,
            [
                10, 10, 10, 10, 10, 10, 10,
                10, 10, 20, 20, 20, 10, 10,
                10, 10, 20, 30, 20, 10, 10,
                10, 10, 20, 20, 20, 10, 10,
                10, 10, 10, 10, 10, 10, 10
            ],
            {kind: 'GREY'}
        );

        Array.from(image.gaussianFilter({fft: false}).data).should.eql(
            [
                11, 11, 15, 17, 15, 11, 11,
                11, 11, 15, 17, 15, 11, 11,
                11, 11, 17, 21, 17, 11, 11,
                11, 11, 15, 17, 15, 11, 11,
                11, 11, 15, 17, 15, 11, 11
            ]
        );

        //console.log(image.gaussian().data);
        Array.from(image.gaussianFilter().data).should.eql(
            [
                11, 11, 15, 17, 15, 11, 11,
                11, 11, 15, 17, 15, 11, 11,
                11, 11, 17, 21, 17, 11, 11,
                11, 11, 15, 17, 15, 11, 11,
                11, 11, 15, 17, 15, 11, 11
            ]
        );
    });

    it('check for GREY image taller than wider', function () {
        let image = new Image(5, 7,
            [
                10, 10, 10, 10, 10,
                10, 10, 10, 10, 10,
                10, 20, 20, 20, 10,
                10, 20, 30, 20, 10,
                10, 20, 20, 20, 10,
                10, 10, 10, 10, 10,
                10, 10, 10, 10, 10
            ],
            {kind: 'GREY'}
        );

        Array.from(image.gaussianFilter({fft: false}).data).should.eql(
            [
                11, 11, 11, 11, 11,
                11, 11, 11, 11, 11,
                15, 15, 17, 15, 15,
                17, 17, 21, 17, 17,
                15, 15, 17, 15, 15,
                11, 11, 11, 11, 11,
                11, 11, 11, 11, 11
            ]
        );


        Array.from(image.gaussianFilter().data).should.eql(
            [
                11, 11, 11, 11, 11,
                11, 11, 11, 11, 11,
                15, 15, 17, 15, 15,
                17, 17, 21, 17, 17,
                15, 15, 17, 15, 15,
                11, 11, 11, 11, 11,
                11, 11, 11, 11, 11
            ]
        );
    });
});

