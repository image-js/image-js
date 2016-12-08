/**
 *
 */
import {Image} from 'test/common';
import getLowestCommonParent from '../getLowestCommonParent';

describe('getLowestCommonParent', function () {
    it('correct common parent for masks with one ancestor each', function () {
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
        getLowestCommonParent(mask1, mask2).should.eql(img1);

    });

    it('correct common parent for masks with same number of ancestors', function () {
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
        let mask2 = mask1.scale({factor: 2});
        let mask3 = mask2.crop();
        let mask4 = img1.mask();
        let mask5 = mask4.rotate(90);
        let mask6 = mask5.scale({factor: 2});
        getLowestCommonParent(mask2, mask4).should.eql(img1);
        getLowestCommonParent(mask3, mask6).should.eql(img1);


    });

    it('correct common parent for masks with a different number of ancestors', function () {
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
        let mask2 = mask1.crop();
        let mask3 = img1.mask();
        let mask4 = mask3.crop();
        let mask5 = mask4.rotate(90);
        let mask6 = mask5.scale({factor: 2});
        let mask7 = mask6.crop();
        getLowestCommonParent(mask2, mask5).should.eql(img1);
        getLowestCommonParent(mask2, mask6).should.eql(img1);
        getLowestCommonParent(mask2, mask7).should.eql(img1);

    });

    it('no common parent for one mask and original image', function () {
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
        (function () {
            getLowestCommonParent(img1, mask1);
        }).should.throw(/No common parent/);
    });
    it('no common parent for masks with different original images', function () {
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
        let img2 = new Image(5, 5,
            [
                0, 0,   0,   0,   0,
                0, 255, 0,   255, 0,
                0, 255, 0,   255, 0,
                0,  0,  0,   255, 0,
                0,  0,  0,   0,   0
            ],
            {kind: 'GREY'}
        );

        let mask1 = img1.mask();
        let mask2 = img2.mask();

        (function () {
            getLowestCommonParent(mask1, mask2);
        }).should.throw(/No common parent/);
    });
});
