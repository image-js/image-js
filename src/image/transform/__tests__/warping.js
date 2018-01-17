import { Image } from 'test/common';
import 'should';

describe('check the warping 4 points transform', function () {
    it('resize without rotation', function () {
        const image = new Image(3, 3,
            [
                1, 2, 3,
                4, 5, 6,
                7, 8, 9
            ],
            { kind: 'GREY' });

        const result = image.warpingFourPoints([[0, 0], [2, 0], [1, 2], [0, 2]]);
        result.width.should.be.aboveOrEqual(2);
        result.height.should.be.aboveOrEqual(2);
        result.width.should.be.belowOrEqual(3);
        result.height.should.be.belowOrEqual(3);
    });

    it('resize without rotation 2', function () {
        const image = new Image(4, 4,
            [
                1, 2, 3, 4,
                5, 6, 7, 8,
                9, 10, 11, 12,
                13, 14, 15, 16
            ],
            { kind: 'GREY' });

        const result = image.warpingFourPoints([[0, 0], [3, 0], [2, 1], [0, 1]]);
        result.width.should.be.aboveOrEqual(3);
        result.height.should.be.aboveOrEqual(1);
        result.width.should.be.belowOrEqual(4);
        result.height.should.be.belowOrEqual(2);
    });
});
