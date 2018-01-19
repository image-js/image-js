import { toBeDeepCloseTo } from 'jest-matcher-deep-close-to';
expect.extend({ toBeDeepCloseTo });

import { Image } from 'test/common';

import { angle } from '../../../util/points';

import minimalBoundingRectangle from '../minimalBoundingRectangle';

describe('Minimal bounding rectangle', function () {
    it('should return the minimal bounding box', function () {
        let image = new Image(
            8,
            8,
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

        const result = minimalBoundingRectangle.call(image);
        expect(result).toHaveLength(4);

        for (let i = 0; i < 4; i++) {
            let currentAngle = angle(
                result[(i + 1) % 4],
                result[i],
                result[(i + 2) % 4]
            );
            expect(Math.abs(currentAngle)).toBeCloseTo(Math.PI / 2, 1e-6);
        }
    });

    it('should return the small bounding box', function () {
        let image = new Image(8, 3, [0b10000001, 0b00011000, 0b10011010], {
            kind: 'BINARY'
        });

        const result = minimalBoundingRectangle.call(image);
        expect(result).toEqual([[0, 2], [7, 2], [7, 0], [0, 0]]);
    });

    it('should return the small bounding box 2', function () {
        let image = new Image(8, 3, [0b01000100, 0b00011000, 0b01011010], {
            kind: 'BINARY'
        });

        const result = minimalBoundingRectangle.call(image);
        expect(result).toEqual([[1, 2], [6, 2], [6, 0], [1, 0]]);
    });

    it('should return the small bounding box diamond', function () {
        let image = new Image(8, 3, [0b00000100, 0b00001110, 0b00000100], {
            kind: 'BINARY'
        });

        const result = minimalBoundingRectangle.call(image);
        expect(result).toBeDeepCloseTo([[6, 1], [5, 0], [4, 1], [5, 2]], 6);
    });

    it('should return the small bounding box rectangle', function () {
        let image = new Image(
            8,
            7,
            [
                0b00000000,
                0b00001000,
                0b00011100,
                0b00111110,
                0b00011111,
                0b00001110,
                0b00000100
            ],
            { kind: 'BINARY' }
        );

        const result = minimalBoundingRectangle.call(image);
        expect(result).toBeDeepCloseTo([[2, 3], [5, 6], [7, 4], [4, 1]], 6);
    });

    it('should return the small bounding box rectangle from points', function () {
        const result = minimalBoundingRectangle({
            originalPoints: [[0, 1], [1, 0], [3, 2], [2, 4], [1, 4], [0, 3]]
        });
        expect(result).toBeDeepCloseTo([[-1, 2], [1, 0], [3.5, 2.5], [1.5, 4.5]], 6);
    });

    it('should return the small bouding rectangle for one point', function () {
        const result = minimalBoundingRectangle({
            originalPoints: [[2, 2]]
        });
        expect(result).toEqual([[2, 2], [2, 2], [2, 2], [2, 2]]);
    });

    it('should return the small bouding rectangle for nothing', function () {
        const result = minimalBoundingRectangle({
            originalPoints: []
        });
        expect(result).toEqual([]);
    });

    it('should return the small bouding rectangle for 2 points', function () {
        const result = minimalBoundingRectangle({
            originalPoints: [[2, 2], [3, 3]]
        });
        expect(result).toBeDeepCloseTo([[2, 2], [3, 3], [3, 3], [2, 2]], 6);
    });
});
