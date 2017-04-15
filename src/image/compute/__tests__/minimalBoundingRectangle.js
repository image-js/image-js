import {Image} from 'test/common';


import {
    angle
} from './../../../util/points.js';


import minimalBoundingRectangle from '../minimalBoundingRectangle';

describe('Minimal bounding rectangle', function () {
    it('should return the minimal bounding box', function () {
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

        const result = minimalBoundingRectangle.call(image);
        result.length.should.equal(4);

        for (let i = 0; i < 4; i++) {
            let currentAngle = angle(result[(i + 1) % 4], result[i], result[(i + 2) % 4]);
            Math.abs(currentAngle).should.approximately(Math.PI / 2, 1e-6);
        }
    });

    it('should return the small bounding box', function () {
        let image = new Image(8, 3,
            [
                0b10000001,
                0b00011000,
                0b10011010,
            ],
            {kind: 'BINARY'}
        );

        const result = minimalBoundingRectangle.call(image);
        result.should.eql([[0, 0], [7, 0], [7, 2], [0, 2]]);
    });

    it('should return the small bounding box 2', function () {
        let image = new Image(8, 3,
            [
                0b01000100,
                0b00011000,
                0b01011010
            ],
            {kind: 'BINARY'}
        );

        const result = minimalBoundingRectangle.call(image);
        result.should.eql([[1, 0], [6, 0], [6, 2], [1, 2]]);
    });

    it('should return the small bounding box diamond', function () {
        let image = new Image(8, 3,
            [
                0b00000100,
                0b00001110,
                0b00000100
            ],
            {kind: 'BINARY'}
        );

        const result = minimalBoundingRectangle.call(image);
        result.should.approximatelyDeep([[5, 0], [6, 1], [5, 2], [4, 1]], 1e-6);
    });


    it('should return the small bounding box rectangle', function () {
        let image = new Image(8, 7,
            [
                0b00000000,
                0b00001000,
                0b00011100,
                0b00111110,
                0b00011111,
                0b00001110,
                0b00000100
            ],
            {kind: 'BINARY'}
        );

        const result = minimalBoundingRectangle.call(image);
        result.should.approximatelyDeep([[7, 4], [5, 6], [2, 3], [4, 1]], 1e-6);
    });

    it('should return the small bounding box rectangle', function () {

        const result = minimalBoundingRectangle({
            originalPoints: [[0, 1], [1, 0], [3, 2], [2, 4], [1, 4], [0, 3]]
        });
        result.should.approximatelyDeep([[-1, 2], [1, 0], [3.5, 2.5], [1.5, 4.5]], 1e-6);
    });
});

