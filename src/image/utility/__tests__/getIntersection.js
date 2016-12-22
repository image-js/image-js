/**
 *
 */
import {Image} from 'test/common';
import getIntersection from '../getIntersection';
import getClosestCommonParent from '../getClosestCommonParent';

describe('getIntersection', function () {
    it('correct intersection for masks with one ancestor each', function () {
        let img1 = new Image(5, 5,
            [
                0, 0, 0, 0, 0,
                0, 255, 255, 255, 0,
                0, 255, 255, 255, 0,
                0, 255, 255, 255, 0,
                0, 0, 0, 0, 0
            ],
            {kind: 'GREY'}
        );
        let mask1 = img1.mask();
        let mask2 = img1.mask();
        console.log(getIntersection(mask1, mask2));

    });
    it('correct intersection for masks with a different number of ancestors', function () {
        let img1 = new Image(5, 5,
            [
                0, 0, 0, 0, 0,
                0, 255, 255, 255, 0,
                0, 255, 255, 255, 0,
                0, 255, 255, 255, 0,
                0, 0, 0, 0, 0
            ],
            {kind: 'GREY'}
        );

        let mask1 = img1.mask();
        let mask2 = mask1.crop({
            x:2,
            y:2,
            width: 3,
            height: 3
        });
        let mask3 = mask2.scale({factor:2});
        console.log(mask2.getRelativePosition(getClosestCommonParent(mask2, mask3)));
        console.log(mask3.getRelativePosition(getClosestCommonParent(mask2, mask3)));


         /*
        let mask3 = img1.mask();
        let mask4 = mask3.crop();
        let mask5 = mask4.rotate(90);
        let mask6 = mask5.scale({factor: 2});
        let mask7 = mask6.crop();*/
        //console.log(getIntersection(mask2, mask3));
        //console.log(getIntersection(mask2, mask6));
        //console.log(getIntersection(mask2, mask7));

    });
});
