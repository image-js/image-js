/**
 *
 */
import {Image} from 'test/common';
import getClosestCommonParent from '../getClosestCommonParent';

describe('getClosestCommonParent', function () {
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
        getClosestCommonParent(mask1, mask2).should.eql(img1);

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
        getClosestCommonParent(mask2, mask4).should.eql(img1);
        getClosestCommonParent(mask3, mask6).should.eql(img1);


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
        getClosestCommonParent(mask2, mask5).should.eql(img1);
        getClosestCommonParent(mask2, mask6).should.eql(img1);
        getClosestCommonParent(mask2, mask7).should.eql(img1);

    });

    it('correct common parent for masks with a multiple number of common ancestors', function () {
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
        let mask3 = mask2.scale({factor: 0.5});
        let mask4 = mask3.crop();
        let mask5 = mask4.rotate(90);
        let mask6 = mask4.scale({factor: 2});
        let mask7 = mask5.crop();
        let mask8 = mask6.rotate(180);
        //console.log(getClosestCommonParent(mask2, mask3));
        //getClosestCommonParent(mask2, mask3).should.eql(img1);
        getClosestCommonParent(mask5, mask6).should.eql(mask4);
        getClosestCommonParent(mask7, mask8).should.eql(mask4);
    });

    it('correct common parent for one mask having the other as an ancestor', function () {
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
        let mask3 = mask2.scale({factor: 0.5});
        let mask4 = mask3.crop();
        getClosestCommonParent(mask2, mask3).should.eql(mask2);
        getClosestCommonParent(mask3, mask4).should.eql(mask3);
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
            getClosestCommonParent(img1, mask1);
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
            getClosestCommonParent(mask1, mask2);
        }).should.throw(/No common parent/);
    });
});
