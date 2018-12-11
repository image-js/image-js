import { Image } from 'test/common';

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
    expect(mask1.getClosestCommonParent(mask2)).toStrictEqual(img1);
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
    let mask2 = mask1.resize({ factor: 2 });
    let mask3 = mask2.resize({ factor: 2 });
    let mask4 = img1.mask();
    let mask5 = mask4.rotate(90);
    let mask6 = mask5.resize({ factor: 2 });
    expect(mask2.getClosestCommonParent(mask4)).toStrictEqual(img1);
    expect(mask3.getClosestCommonParent(mask6)).toStrictEqual(img1);
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
    let mask2 = mask1.resize({ factor: 0.2 });
    let mask3 = img1.mask();
    let mask4 = mask3.resize({ factor: 2 });
    let mask5 = mask4.rotate(90);
    let mask6 = mask5.resize({ factor: 0.5 });
    let mask7 = mask6.resize({ factor: 2 });
    expect(mask2.getClosestCommonParent(mask5)).toStrictEqual(img1);
    expect(mask2.getClosestCommonParent(mask6)).toStrictEqual(img1);
    expect(mask2.getClosestCommonParent(mask7)).toStrictEqual(img1);
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
    let mask2 = mask1.resize({ factor: 2 });
    let mask3 = mask2.resize({ factor: 0.5 });
    let mask4 = mask3.resize({ factor: 0.1 });
    let mask5 = mask4.rotate(90);
    let mask6 = mask4.resize({ factor: 2 });
    let mask7 = mask5.resize({ factor: 1.5 });
    let mask8 = mask6.rotate(180);
    expect(mask5.getClosestCommonParent(mask6)).toStrictEqual(mask4);
    expect(mask7.getClosestCommonParent(mask8)).toStrictEqual(mask4);
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
    let mask2 = mask1.resize({ factor: 0.5 });
    let mask3 = mask2.resize({ factor: 0.5 });
    let mask4 = mask3.resize({ factor: 0.5 });
    expect(mask2.getClosestCommonParent(mask3)).toStrictEqual(mask2);
    expect(mask3.getClosestCommonParent(mask4)).toStrictEqual(mask3);
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
    expect(img1.getClosestCommonParent(mask1)).toStrictEqual(img1);
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

    expect(mask1.getClosestCommonParent(mask2)).toStrictEqual(img1);
  });
});
