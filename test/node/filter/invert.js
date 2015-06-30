'use strict';

var invertRGBA = require('../../../lib/filter/invert').invertRGBA;

describe('invert RGBA', function () {
    it('should invert colors, not alpha', function () {

        var pixels = [230, 83, 120, 255, 100, 140, 13, 240];
        var inverted = [25, 172, 135, 255, 155, 115, 242, 240];

        invertRGBA(pixels);
        pixels.should.eql(inverted);

    });
});
