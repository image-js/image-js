import { toBeDeepCloseTo, toMatchCloseTo } from 'jest-matcher-deep-close-to';
import oneRoi from 'test/oneRoi';

expect.extend({ toBeDeepCloseTo, toMatchCloseTo });

describe('ROI ped: diameter of a circle of equal perimeter', function () {
  it('perimeter 6', function () {
    let roi = oneRoi`
        111
        111
        010
      `;

    let diameter = roi.ped;
    let perimeter = Math.PI * diameter;

    expect(perimeter).toBeCloseTo(6);
  });

  it('perimeter 8', function () {
    let roi = oneRoi`
        111
        111
        111
      `;

    let diameter = roi.ped;
    let perimeter = Math.PI * diameter;

    expect(perimeter).toBeCloseTo(8);
  });

  it('perimeter 16', function () {
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

    expect(perimeter).toBeCloseTo(16);
  });
});
