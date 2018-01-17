import { Image } from 'test/common';
import 'should';

describe('check the pad transform', function () {
    it('check the right pad extract for GREY image', function () {

        let image = new Image(2, 2,
            [
                1, 2,
                3, 4
            ],
            { kind: 'GREY' }
        );

        Array.from(image.pad().data).should.eql(
            [
                1, 2,
                3, 4
            ]
        );

        Array.from(image.pad({ size: 1 }).data).should.eql(
            [
                1, 1, 2, 2,
                1, 1, 2, 2,
                3, 3, 4, 4,
                3, 3, 4, 4
            ]
        );

        Array.from(image.pad({ size: 2 }).data).should.eql(
            [
                1, 1, 1, 2, 2, 2,
                1, 1, 1, 2, 2, 2,
                1, 1, 1, 2, 2, 2,
                3, 3, 3, 4, 4, 4,
                3, 3, 3, 4, 4, 4,
                3, 3, 3, 4, 4, 4
            ]
        );

        Array.from(image.pad({ algorithm: 'set', size: 1, color: [9] }).data).should.eql(
            [
                9, 9, 9, 9,
                9, 1, 2, 9,
                9, 3, 4, 9,
                9, 9, 9, 9
            ]
        );

        (function () {
            image.pad({ algorithm: 'set', size: 1, color: [0, 1] });
        }).should.throw(/the color array must have the same/);
    });


});

