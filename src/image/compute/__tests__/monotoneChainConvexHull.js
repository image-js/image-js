import { Image } from 'test/common';
import 'should';

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
            { kind: 'BINARY' }
        );

        image.monotoneChainConvexHull().should.eql([
            [2, 3],
            [2, 4],
            [3, 6],
            [4, 6],
            [7, 4],
            [7, 3],
            [4, 1],
            [3, 1]
        ]);
    });

    it('should return the convex hull for one point', function () {
        let image = new Image(1, 1,
            [
                0b10000000
            ],
            { kind: 'BINARY' }
        );

        image.monotoneChainConvexHull().should.eql([]);
    });

    it('should return the convex hull for two points', function () {
        let image = new Image(1, 2,
            [
                0b11000000
            ],
            { kind: 'BINARY' }
        );

        image.monotoneChainConvexHull().should.eql([
            [0, 0],
            [0, 1]
        ]);
    });

});
