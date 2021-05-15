import { toBeDeepCloseTo, toMatchCloseTo } from 'jest-matcher-deep-close-to';

import oneRoi from 'test/oneRoi';

expect.extend({ toBeDeepCloseTo, toMatchCloseTo });

describe('ROI minimum bounding rectangle', function () {
  it('should return the bounding rectangle', function () {
    let roi = oneRoi`
        010
        111
        010
      `;
    expect(roi.mbr).toMatchCloseTo(
      {
        width: 2.8284,
        height: 2.8284,
        surface: 8,
        perimeter: 11.3137,
        rectangle: [
          [-0.5, 1.5],
          [1.5, 3.5],
          [3.5, 1.5],
          [1.5, -0.5],
        ],
      },
      3,
    );
  });

  it('should return the bounding rectangle for one point', function () {
    let roi = oneRoi`
        1
      `;
    expect(roi.mbr).toMatchCloseTo(
      {
        width: 1,
        rectangle: [
          [0, 0],
          [0, 1],
          [1, 1],
          [1, 0],
        ],
        surface: 1,
        height: 1,
        perimeter: 4,
      },
      3,
    );
  });

  it('should return the bounding rectangle for two points', function () {
    let roi = oneRoi`
        1
        1
      `;
    expect(roi.mbr).toMatchCloseTo(
      {
        width: 2,
        rectangle: [
          [0, 0],
          [0, 2],
          [1, 2],
          [1, 0],
        ],
        surface: 2,
        height: 1,
        perimeter: 6,
      },
      3,
    );
  });
});
