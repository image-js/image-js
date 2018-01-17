import { Image } from 'test/common';
import 'should';

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
            { kind: 'GREY' }
        );
        let mask1 = img1.mask();
        let mask2 = img1.mask();
        mask1.getClosestCommonParent(mask2).should.eql(img1);

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
            { kind: 'GREY' }
        );

        let mask1 = img1.mask();
        let mask2 = mask1.scale({ factor: 2 });
        let mask3 = mask2.scale({ factor: 2 });
        let mask4 = img1.mask();
        let mask5 = mask4.rotate(90);
        let mask6 = mask5.scale({ factor: 2 });
        mask2.getClosestCommonParent(mask4).should.eql(img1);
        mask3.getClosestCommonParent(mask6).should.eql(img1);


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
            { kind: 'GREY' }
        );

        let mask1 = img1.mask();
        let mask2 = mask1.scale({ factor: 0.2 });
        let mask3 = img1.mask();
        let mask4 = mask3.scale({ factor: 2 });
        let mask5 = mask4.rotate(90);
        let mask6 = mask5.scale({ factor: 0.5 });
        let mask7 = mask6.scale({ factor: 2 });
        mask2.getClosestCommonParent(mask5).should.eql(img1);
        mask2.getClosestCommonParent(mask6).should.eql(img1);
        mask2.getClosestCommonParent(mask7).should.eql(img1);

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
            { kind: 'GREY' }
        );

        let mask1 = img1.mask();
        let mask2 = mask1.scale({ factor: 2 });
        let mask3 = mask2.scale({ factor: 0.5 });
        let mask4 = mask3.scale({ factor: 0.1 });
        let mask5 = mask4.rotate(90);
        let mask6 = mask4.scale({ factor: 2 });
        let mask7 = mask5.scale({ factor: 1.5 });
        let mask8 = mask6.rotate(180);
        mask5.getClosestCommonParent(mask6).should.eql(mask4);
        mask7.getClosestCommonParent(mask8).should.eql(mask4);
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
            { kind: 'GREY' }
        );

        let mask1 = img1.mask();
        let mask2 = mask1.scale({ factor: 0.5 });
        let mask3 = mask2.scale({ factor: 0.5 });
        let mask4 = mask3.scale({ factor: 0.5 });
        mask2.getClosestCommonParent(mask3).should.eql(mask2);
        mask3.getClosestCommonParent(mask4).should.eql(mask3);
    });

    it('common parent for one mask and original image is original image', function () {
        let img1 = new Image(5, 5,
            [
                0, 0, 0, 0, 0,
                0, 255, 255, 255, 0,
                0, 255, 255, 255, 0,
                0, 255, 255, 255, 0,
                0, 0, 0, 0, 0
            ],
            { kind: 'GREY' }
        );

        let mask1 = img1.mask();
        img1.getClosestCommonParent(mask1).should.eql(img1);
    });

    it('common parent for masks with different original images', function () {
        let img1 = new Image(5, 5,
            [
                0, 0, 0, 0, 0,
                0, 255, 255, 255, 0,
                0, 255, 255, 255, 0,
                0, 255, 255, 255, 0,
                0, 0, 0, 0, 0
            ],
            { kind: 'GREY' }
        );
        let img2 = new Image(5, 5,
            [
                0, 0,   0,   0,   0,
                0, 255, 0,   255, 0,
                0, 255, 0,   255, 0,
                0,  0,  0,   255, 0,
                0,  0,  0,   0,   0
            ],
            { kind: 'GREY' }
        );

        let mask1 = img1.mask();
        let mask2 = img2.mask();

        mask1.getClosestCommonParent(mask2).should.eql(img1);
    });
});
