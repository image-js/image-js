import ROIMapper from '../../../../src/image/roi/creator/fromPixels';
import {Image} from '../../common';

describe('we check createROIMapFromPixels', function () {
    it('should yield the right map', function () {
        let image = new Image(5, 5, {kind: 'GREY'});

        let pixels = [[1,1],[3,2],[4,4],[5,0]];

        let mapPixels = ROIMapper.call(image, pixels, {kind: 'smallCross'}).pixels;

        Array.from(mapPixels).should.eql([
            0, 1, 0, 0, 4,
            1, 1, 1, 2, 0,
            0, 1, 2, 2, 2,
            0, 0, 0, 2, 3,
            0, 0, 0, 3, 3
        ]);
    });
});


