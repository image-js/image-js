import RoiMapper from '../creator/fromWaterShed';
import {Image} from 'test/common';

describe('Merge Roi', function () {
    it('should fusion 2 ROIs', function () {

        let image = new Image(10,10,
            [
                3,3,3,3,3,3,3,2,2,2,
                3,3,2,2,2,3,3,2,2,4,
                4,3,2,1,2,2,3,1,2,4,
                4,3,2,2,2,2,3,3,3,4,
                4,4,4,3,2,3,3,3,3,4,
                4,4,4,3,3,3,3,3,3,3,
                4,3,3,3,3,3,2,2,2,3,
                4,4,3,3,3,3,2,1,2,2,
                4,4,4,4,3,2,2,2,2,3,
                4,4,4,4,3,3,3,3,2,3
            ],
            {kind: 'GREY'}
        );
        let mask = new Image(10, 10, {kind: 'BINARY'});
        for (let i = 0; i < 10; i++) {
            for (let j = 0; j < 10; j++) {
                if (image.data[i + j * 10] !== 4) {
                    mask.setBitXY(i, j);
                }
            }
        }

        let map = RoiMapper.call(image, {fillMaxValue:5, mask:mask, interval: 1});
        let roiManager = image.getRoiManager();
        roiManager.putMap(map.data);

        roiManager.mergeRoi({minCommonBorderLength:3});

        Array.from(map.data).should.eql(
            [
                1,1,1,1,1,1,1,1,1,1,
                1,1,1,1,1,1,1,1,1,0,
                0,1,1,1,1,1,1,1,1,0,
                0,1,1,1,1,1,1,1,1,0,
                0,0,0,1,1,1,1,1,1,0,
                0,0,0,3,1,3,3,3,3,3,
                0,3,3,3,3,3,3,3,3,3,
                0,0,3,3,3,3,3,3,3,3,
                0,0,0,0,3,3,3,3,3,3,
                0,0,0,0,3,3,3,3,3,3
            ]
        );
    });
});
