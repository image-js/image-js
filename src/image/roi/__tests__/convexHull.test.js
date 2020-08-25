import { toBeDeepCloseTo, toMatchCloseTo } from 'jest-matcher-deep-close-to';
import oneRoi from 'test/oneRoi';

expect.extend({ toBeDeepCloseTo, toMatchCloseTo });

describe('ROI convexHull', function () {
  it('cross', function () {
    let roi = oneRoi`
        010
        111
        010
      `;

    expect(roi.convexHull).toMatchCloseTo(
      {
        surface: 2,
        perimeter: 5.6568,
        polyline: [
          [0, 1],
          [1, 2],
          [2, 1],
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
        surface: 2,
        perimeter: 6.8284,
        polyline: [
          [0, 0],
          [0, 2],
          [2, 0],
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
      surface: 0,
      perimeter: 0,
      polyline: [],
    });
  });

  it('should return the convex hull for two points', function () {
    let roi = oneRoi`
        1
        1
      `;

    expect(roi.convexHull).toMatchCloseTo({
      surface: 0,
      perimeter: 2,
      polyline: [
        [0, 0],
        [0, 1],
      ],
    });
  });
});
