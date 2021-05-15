import { toBeDeepCloseTo, toMatchCloseTo } from 'jest-matcher-deep-close-to';

import oneRoi from 'test/oneRoi';

expect.extend({ toBeDeepCloseTo, toMatchCloseTo });

describe('ROI convexHull', function () {
  it('square', function () {
    let roi = oneRoi`
        000
        011
        011
      `;

    expect(roi.convexHull).toStrictEqual({
      polyline: [
        [0, 0],
        [0, 2],
        [2, 2],
        [2, 0],
      ],
      surface: 4,
      perimeter: 8,
    });
  });

  it('cross', function () {
    let roi = oneRoi`
        010
        111
        010
      `;

    expect(roi.convexHull).toMatchCloseTo(
      {
        surface: 7,
        perimeter: 9.656854,
        polyline: [
          [0, 1],
          [0, 2],
          [1, 3],
          [2, 3],
          [3, 2],
          [3, 1],
          [2, 0],
          [1, 0],
        ],
      },
      3,
    );
  });

  it('triangle', function () {
    let roi = oneRoi`
        111
        100
        100
      `;

    expect(roi.convexHull).toMatchCloseTo(
      {
        surface: 7,
        perimeter: 10.8284,
        polyline: [
          [0, 0],
          [0, 3],
          [1, 3],
          [3, 1],
          [3, 0],
        ],
      },
      3,
    );
  });

  it('should return the convex hull for one point', function () {
    let roi = oneRoi`
        1
      `;
    expect(roi.convexHull).toStrictEqual({
      surface: 1,
      perimeter: 4,
      polyline: [
        [0, 0],
        [0, 1],
        [1, 1],
        [1, 0],
      ],
    });
  });

  it('should return the convex hull for two points', function () {
    let roi = oneRoi`
        1
        1
      `;

    expect(roi.convexHull).toMatchCloseTo({
      surface: 2,
      perimeter: 6,
      polyline: [
        [0, 0],
        [0, 2],
        [1, 2],
        [1, 0],
      ],
    });
  });
});
