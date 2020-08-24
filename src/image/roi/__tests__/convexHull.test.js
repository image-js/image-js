import oneRoi from 'test/oneRoi';

describe('ROI convexHull', function () {
  it('cross', function () {
    let roi = oneRoi`
        010
        111
        010
      `;

    expect(roi.convexHull).toStrictEqual([
      [0, 1],
      [1, 2],
      [2, 1],
      [1, 0],
    ]);
  });

  it('triangle', function () {
    let roi = oneRoi`
        111
        100
        100
      `;

    expect(roi.convexHull).toStrictEqual([
      [0, 0],
      [0, 2],
      [2, 0],
    ]);
  });

  it('should return the convex hull for one point', function () {
    let roi = oneRoi`
        1
      `;
    expect(roi.convexHull).toStrictEqual([]);
  });

  it('should return the convex hull for two points', function () {
    let roi = oneRoi`
        1
        1
      `;
    expect(roi.convexHull).toStrictEqual([
      [0, 0],
      [0, 1],
    ]);
  });
});
