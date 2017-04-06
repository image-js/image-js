import {Image} from 'test/common';

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
            angle(result[i], result[(i + 1) % 4], result[(i + 2) % 4]).should.approximately(Math.PI / 4, Number.EPSILON);
        }
    });
});

function angle(p1, p2, p3) {
    return Math.acos((l(p1, p2) ** 2 + l(p1, p3) ** 2 - l(p2, p3) ** 2) / (2 * l(p1, p2) * l(p1, p3)));
}

function l(p1, p2) {
    return Math.sqrt((p1[0] - p2[0]) ** 2 + (p1[1] - p2[1]) ** 2);
}
