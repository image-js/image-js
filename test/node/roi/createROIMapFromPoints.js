import ROIMapper from '../../../src/image/roi/creator/fromPoints';
import {Image} from '../common';

describe('we check createROIMapFromPoints', function () {
    it('should yield the right map', function () {
        let image = new Image(5, 5, {kind: 'GREY'});

        let points = [[1,3,4,5],[1,2,4,0]];

        let pixels = ROIMapper.call(image, points, {predefined: 'smallCross'}).pixels;

        Array.from(pixels).should.eql([
            0, 1, 0, 0, 4,
            1, 1, 1, 2, 0,
            0, 1, 2, 2, 2,
            0, 0, 0, 2, 3,
            0, 0, 0, 3, 3
        ]);
    });

});


