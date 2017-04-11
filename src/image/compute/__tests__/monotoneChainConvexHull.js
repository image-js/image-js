import {Image} from 'test/common';

describe('Monotone Chain Convex Hull', function () {
    it('should return the convex hull', function () {
        let image = new Image(8, 8,
            [
                0b00000000,
                0b00011000,
                0b00011000,
                0b00111111,
                0b00111111,
                0b00011000,
                0b00011000,
                0b00000000
            ],
            {kind: 'BINARY'}
        );

        image.monotoneChainConvexHull().should.eql([
            [2, 3],
            [3, 1],
            [4, 1],
            [7, 3],
            [7, 4],
            [4, 6],
            [3, 6],
            [2, 4]
        ]);
    });
});
