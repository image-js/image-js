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
        width: 1.4142135623730951,
        height: 1.414213562373095,
        rectangle: [
          [2, 1],
          [1, 0],
          [0, 1],
          [1, 2],
        ],
        surface: 2,
        perimeter: 5.65685424949238,
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
        width: 0,
        rectangle: [],
        surface: 0,
        height: 0,
        perimeter: 0,
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
        width: 1,
        rectangle: [
          [0, 0],
          [0, 1],
          [0, 1],
          [0, 0],
        ],
        surface: 0,
        height: 0,
        perimeter: 2,
      },
      3,
    );
  });
});
