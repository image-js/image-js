/**
 *
 */
import {Image} from 'test/common';
import getIntersection from '../getIntersection';
import getClosestCommonParent from '../getClosestCommonParent';

describe.only('getIntersection', function () {
    it('correct intersection for masks with one ancestor each', function () {
        let img1 = new Image(5, 5,
            [
                255, 255, 0,   0,   0,
                255, 255, 0,   0,   0,
                0,   0,   255, 255, 0,
                0,   0,   255, 255, 0,
                0,   0,   0,   0,   0
            ],
            {kind: 'GREY'}
        );

        let roiManager1 = img1.getRoiManager();
        let mask1 = img1.mask();
        roiManager1.fromMask(mask1);
        roiManager1.getRois();
        console.log(roiManager1.getRois());

    });
});
