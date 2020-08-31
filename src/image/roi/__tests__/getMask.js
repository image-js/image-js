import array from 'test/array';
import binary from 'test/binary';
import { Image } from 'test/common';

describe('Roi#getMask', function () {
  it('should yield the right mask', function () {
    let image = new Image(5, 5, { kind: 'GREY' });

    let points = [
      [1, 1],
      [3, 2],
      [4, 4],
      [5, 0],
    ];

    let roiManager = image.getRoiManager();
    roiManager.fromPoints(points, { kind: 'smallCross' });

    expect(Array.from(roiManager.getData())).toStrictEqual(array`
      0,1,0,0,4,
      1,1,1,2,0,
      0,1,2,2,2,
      0,0,0,2,3,
      0,0,0,3,3,
    `);

    let mask = roiManager.getMask({ minSurface: 5, maxSurface: 5 });

    let expected = binary`
      01000
      11110
      01111
      00010
      00000
    `;

    // only 2 Roi will be selected !
    expect(mask.data).toStrictEqual(expected.data);
  });

  it('should yield the right mask, position and resize', function () {
    const data = array`
      0,0,0,0,0,
      0,1,1,1,0,
      0,1,1,1,0,
      0,1,1,1,0,
      0,0,0,0,0,
    `;
    let image = new Image(5, 5, data, { kind: 'GREY' });

    let mask = image.mask({ threshold: 1, algorithm: 'threshold' });

    const expected = binary`
      00000
      01110
      01110
      01110
      00000
    `;
    expect(mask.data).toStrictEqual(expected.data);

    let roiManager = image.getRoiManager();
    roiManager.fromMask(mask, { positive: true, negative: false });

    let rois = roiManager.getRois().sort((a, b) => a.surface - b.surface);
    expect(rois[0].surface).toBe(9);
    expect(rois[1].surface).toBe(16);
    expect(rois[0].getMask().position).toStrictEqual([1, 1]);
    expect(rois[1].getMask().position).toStrictEqual([0, 0]);

    expect(rois[0].getMask().parent.size).toBe(25); // the mask image
    expect(rois[0].getMask().parent.parent.size).toBe(25); // the grey image
    expect(rois[0].getMask().parent.parent.parent === null).toBe(true); // no parent to grey image

    let roi0Mask = rois[0].getMask({ scale: 0.34 });
    expect(roi0Mask.position).toStrictEqual([2, 2]);
    expect(roi0Mask.parent.size).toBe(25); // the mask image
    expect(roi0Mask.parent.parent.size).toBe(25); // the grey image
    expect(roi0Mask.parent.parent.parent === null).toBe(true); // no parent to grey image

    let roi1Mask = rois[1].getMask({ scale: 0.2 });
    expect(roi1Mask.position).toStrictEqual([2, 2]);

    let painted = roiManager.paint({
      color: 'red',
      scale: 0.34,
      positive: true,
      negative: false,
    });
    expect(Array.from(painted.getChannel(0).data)).toStrictEqual(array`
      0, 0, 0  , 0, 0,
      0, 1, 1  , 1, 0,
      0, 1, 255, 1, 0,
      0, 1, 1  , 1, 0,
      0, 0, 0  , 0, 0,
    `);
  });

  it('should work with convex hull', () => {
    const data = array`
      0,0,0,0,0,0
      0,1,1,1,0,0
      0,1,0,0,0,0
      0,1,0,0,0,0
      0,1,1,1,1,1
      0,0,0,0,0,0
    `;
    let image = new Image(6, 6, data, { kind: 'GREY' });

    let mask = image.mask({ threshold: 1, algorithm: 'threshold' });
    let roiManager = image.getRoiManager();
    roiManager.fromMask(mask, { positive: true, negative: false });
    const rois = roiManager.getRois();
    expect(rois).toHaveLength(2);

    const roi = rois[0];

    const convexHullMask = roi.convexHullMask;
    const expected = binary`
      111100
      100010
      100010
      100001
      111111
    `;
    expect(convexHullMask.data).toStrictEqual(expected.data);
  });

  it('should work with mbr', () => {
    const data = array`
      0,0,0,0,0,0,
      0,1,1,1,0,0,
      0,1,0,0,0,0,
      0,1,0,0,0,0,
      0,1,1,1,1,1,
      0,0,0,0,0,0,
    `;
    let image = new Image(6, 6, data, { kind: 'GREY' });

    let mask = image.mask({ threshold: 1, algorithm: 'threshold' });
    let roiManager = image.getRoiManager();
    roiManager.fromMask(mask, { positive: true, negative: false });
    const rois = roiManager.getRois();
    expect(rois).toHaveLength(2);

    const roi = rois[0];
    const mbrMask = roi.mbrMask;
    const expected = binary`
      111111
      100001
      100001
      100001
      111111
    `;
    expect(mbrMask.data).toStrictEqual(expected.data);
  });
});
