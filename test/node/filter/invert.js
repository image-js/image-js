'use strict';

import {IJ} from '../common';

describe('invert 3 components', function () {
    it('should invert colors, not alpha', function () {

        let image = new IJ(1,2,[230, 83, 120, 255, 100, 140, 13, 240]);

        let inverted = [25, 172, 135, 255, 155, 115, 242, 240];

        image.invert();
        image.data.should.eql(inverted);

    });
});
