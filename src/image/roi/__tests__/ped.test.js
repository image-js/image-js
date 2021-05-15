import { toBeDeepCloseTo, toMatchCloseTo } from 'jest-matcher-deep-close-to';

import oneRoi from 'test/oneRoi';

expect.extend({ toBeDeepCloseTo, toMatchCloseTo });

describe('ROI ped: diameter of a circle of equal perimeter', function () {
  it('nearly square', function () {
    let roi = oneRoi`
        111
        111
        010
      `;

    let diameter = roi.ped;
    let perimeter = Math.PI * diameter;

    expect(perimeter).toBeCloseTo(8.485, 2);
  });

  it('squere', function () {
    let roi = oneRoi`
        111
        111
        111
      `;

    let diameter = roi.ped;
    let perimeter = Math.PI * diameter;

    expect(perimeter).toBeCloseTo(9.656);
  });

  it('empty square', function () {
    let roi = oneRoi`
        0000000
        0111110
        0111110
        0110110
        0111110
        0111110
        0000000
      `;

    let diameter = roi.ped;
    let perimeter = Math.PI * diameter;

    expect(perimeter).toBeCloseTo(17.656);
  });
});
