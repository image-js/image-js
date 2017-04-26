import {Image} from 'test/common';
import 'should';

describe('check the setBorder transform', function () {
    it('check the pad for GREY image', function () {

        let image = new Image(4, 4,
            [
                1, 2, 3, 4,
                5, 6, 7, 8,
                9, 10, 11, 12,
                13, 14, 15, 16
            ],
            {kind: 'GREY'}
        );

        Array.from(image.setBorder().data).should.eql(
            [
                1, 2, 3, 4,
                5, 6, 7, 8,
                9, 10, 11, 12,
                13, 14, 15, 16
            ]
        );

        Array.from(image.setBorder({size: 1}).data).should.eql(
            [
                6, 6, 7, 7,
                6, 6, 7, 7,
                10, 10, 11, 11,
                10, 10, 11, 11
            ]
        );

        Array.from(image.setBorder({size: 1, algorithm: 'set', color: [20]}).data).should.eql(
            [
                20, 20, 20, 20,
                20, 6, 7, 20,
                20, 10, 11, 20,
                20, 20, 20, 20
            ]
        );

    });

    it('check the pad for larger GREY image', function () {
        let image = new Image(6, 6,
            [
                1, 1, 1, 2, 2, 2,
                1, 1, 1, 2, 2, 2,
                1, 1, 1, 2, 2, 2,
                3, 3, 3, 4, 4, 4,
                3, 3, 3, 4, 4, 4,
                3, 3, 3, 4, 4, 4
            ],
            {kind: 'GREY'}
        );


        Array.from(image.setBorder({size: 2, algorithm: 'set', color: [10]}).data).should.eql(
            [
                10, 10, 10, 10, 10, 10,
                10, 10, 10, 10, 10, 10,
                10, 10, 1, 2, 10, 10,
                10, 10, 3, 4, 10, 10,
                10, 10, 10, 10, 10, 10,
                10, 10, 10, 10, 10, 10
            ]
        );


        (function () {
            image.setBorder({algorithm: 'set', size: 1, color: [0, 1]});
        }).should.throw(/the color array must have the same/);
    });


});

