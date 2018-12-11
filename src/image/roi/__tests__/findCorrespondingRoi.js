import { Image } from 'test/common';

describe('findCorrespondingRoi', function () {
  it('should yield the correct object containing corresponding roi ids and pixels', function () {
    let img1 = new Image(5, 5,
      [
        0, 0,   0,   0,   0,
        0, 255, 255, 255, 0,
        0, 255, 255, 255, 0,
        0, 255, 255, 255, 0,
        0, 0,   0,   0,   0
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


    expect(img1.width).toBe(5);
    expect(img1.height).toBe(5);
    expect(img2.width).toBe(5);
    expect(img2.height).toBe(5);

    let roiManager1 = img1.getRoiManager();
    let mask1 = img1.mask();
    roiManager1.fromMask(mask1);

    let roiManager2 = img2.getRoiManager();
    let mask2 = img2.mask();
    roiManager2.fromMask(mask2);

    let roiMap2 = roiManager2.getMap();

    let related = roiManager1.findCorrespondingRoi(roiMap2);
    expect(Array.from(related[0].id)).toStrictEqual([1, -1, 2]);
    expect(Array.from(related[0].surface)).toStrictEqual([2, 4, 3]);
    expect(Array.from(related[0].roiSurfaceCovered)).toStrictEqual([(2 / 9), (4 / 9), (3 / 9)]);
    expect(related[0].same).toStrictEqual(5);
    expect(related[0].opposite).toStrictEqual(4);
    expect(related[0].total).toStrictEqual(9);
    expect(Array.from(related[1].id)).toStrictEqual([-1]);
    expect(Array.from(related[1].surface)).toStrictEqual([16]);
    expect(Array.from(related[1].roiSurfaceCovered)).toStrictEqual([1]);
    expect(related[1].same).toStrictEqual(16);
    expect(related[1].opposite).toStrictEqual(0);
    expect(related[1].total).toStrictEqual(16);
  });
  it('should yield the correct object containing corresponding roi ids and pixels (switch imgs from prev test)', function () {
    let img1 = new Image(5, 5,
      [
        0, 0,   0,   0,   0,
        0, 255, 0,   255, 0,
        0, 255, 0,   255, 0,
        0,  0,  0,   255, 0,
        0,  0,  0,   0,   0
      ],
      { kind: 'GREY' }
    );

    let img2 = new Image(5, 5,
      [
        0, 0,   0,   0,   0,
        0, 255, 255, 255, 0,
        0, 255, 255, 255, 0,
        0, 255, 255, 255, 0,
        0, 0,   0,   0,   0
      ],
      { kind: 'GREY' }
    );

    expect(img1.width).toBe(5);
    expect(img1.height).toBe(5);
    expect(img2.width).toBe(5);
    expect(img2.height).toBe(5);

    let roiManager1 = img1.getRoiManager();
    let mask1 = img1.mask();
    roiManager1.fromMask(mask1);

    let roiManager2 = img2.getRoiManager();
    let mask2 = img2.mask();
    roiManager2.fromMask(mask2);
    let roiMap2 = roiManager2.getMap();

    let related = roiManager1.findCorrespondingRoi(roiMap2);
    expect(Array.from(related[0].id)).toStrictEqual([1]);
    expect(Array.from(related[0].surface)).toStrictEqual([2]);
    expect(Array.from(related[0].roiSurfaceCovered)).toStrictEqual([1]);
    expect(related[0].same).toStrictEqual(2);
    expect(related[0].opposite).toStrictEqual(0);
    expect(related[0].total).toStrictEqual(2);
    expect(Array.from(related[1].id)).toStrictEqual([1]);
    expect(Array.from(related[1].surface)).toStrictEqual([3]);
    expect(Array.from(related[1].roiSurfaceCovered)).toStrictEqual([1]);
    expect(related[1].same).toStrictEqual(3);
    expect(related[1].opposite).toStrictEqual(0);
    expect(related[1].total).toStrictEqual(3);
    expect(Array.from(related[2].id)).toStrictEqual([-1, 1]);
    expect(Array.from(related[2].surface)).toStrictEqual([16, 4]);
    expect(Array.from(related[2].roiSurfaceCovered)).toStrictEqual([(16 / 20), (4 / 20)]);
    expect(related[2].same).toStrictEqual(16);
    expect(related[2].opposite).toStrictEqual(4);
    expect(related[2].total).toStrictEqual(20);
  });

  it('should yield the correct object containing 2 elements with same roi ids and different number of pixels (covering entire image)', function () {
    let img1 = new Image(5, 5,
      [
        0, 0,   0,   0,   0,
        0, 255, 255, 255, 0,
        0, 255, 255, 255, 0,
        0, 255, 255, 255, 0,
        0, 0,   0,   0,   0
      ],
      { kind: 'GREY' }
    );


    let img2 = new Image(5, 5,
      [
        0, 0, 0, 0, 0,
        0, 0, 0, 0, 0,
        0, 0, 0, 0, 0,
        0, 0, 0, 0, 0,
        0, 0, 0, 0, 0
      ],
      { kind: 'GREY' }
    );


    expect(img1.width).toBe(5);
    expect(img1.height).toBe(5);
    expect(img2.width).toBe(5);
    expect(img2.height).toBe(5);

    let roiManager1 = img1.getRoiManager();
    let mask1 = img1.mask();
    roiManager1.fromMask(mask1);

    let roiManager2 = img2.getRoiManager();
    let mask2 = img2.mask();
    roiManager2.fromMask(mask2);

    let roiMap2 = roiManager2.getMap();

    let related = roiManager1.findCorrespondingRoi(roiMap2);
    expect(Array.from(related[0].id)).toStrictEqual([-1]);
    expect(Array.from(related[0].surface)).toStrictEqual([9]);
    expect(Array.from(related[0].roiSurfaceCovered)).toStrictEqual([1]);
    expect(related[0].same).toStrictEqual(0);
    expect(related[0].opposite).toStrictEqual(9);
    expect(related[0].total).toStrictEqual(9);
    expect(Array.from(related[1].id)).toStrictEqual([-1]);
    expect(Array.from(related[1].surface)).toStrictEqual([16]);
    expect(Array.from(related[1].roiSurfaceCovered)).toStrictEqual([1]);
    expect(related[1].same).toStrictEqual(16);
    expect(related[1].opposite).toStrictEqual(0);
    expect(related[1].total).toStrictEqual(16);
  });

  it('should yield the correct object containing 1 element with one roi id and al of pixels (covering entire image)', function () {
    let img1 = new Image(5, 5,
      [
        0, 0, 0, 0, 0,
        0, 0, 0, 0, 0,
        0, 0, 0, 0, 0,
        0, 0, 0, 0, 0,
        0, 0, 0, 0, 0
      ],
      { kind: 'GREY' }
    );


    let img2 = new Image(5, 5,
      [
        0, 0, 0, 0, 0,
        0, 0, 0, 0, 0,
        0, 0, 0, 0, 0,
        0, 0, 0, 0, 0,
        0, 0, 0, 0, 0
      ],
      { kind: 'GREY' }
    );


    expect(img1.width).toBe(5);
    expect(img1.height).toBe(5);
    expect(img2.width).toBe(5);
    expect(img2.height).toBe(5);

    let roiManager1 = img1.getRoiManager();
    let mask1 = img1.mask();
    roiManager1.fromMask(mask1);

    let roiManager2 = img2.getRoiManager();
    let mask2 = img2.mask();
    roiManager2.fromMask(mask2);

    let roiMap2 = roiManager2.getMap();

    let related = roiManager1.findCorrespondingRoi(roiMap2);
    expect(Array.from(related[0].id)).toStrictEqual([-1]);
    expect(Array.from(related[0].surface)).toStrictEqual([25]);
    expect(Array.from(related[0].roiSurfaceCovered)).toStrictEqual([1]);
  });
});
