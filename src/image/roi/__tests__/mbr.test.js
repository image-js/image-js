import oneRoi from 'test/oneRoi';
import { toBeDeepCloseTo, toMatchCloseTo } from 'jest-matcher-deep-close-to';
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
        length: 1.4142135623730951,
        width: 1.414213562373095,
        rectangle: [
          [2, 1],
          [1, 0],
          [0, 1],
          [1, 2],
        ],
        surface: 2,
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
        length: 0,
        rectangle: [],
        surface: 0,
        width: 0,
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
        length: 1,
        rectangle: [
          [0, 0],
          [0, 1],
          [0, 1],
          [0, 0],
        ],
        surface: 0,
        width: 0,
      },
      3,
    );
  });
});
