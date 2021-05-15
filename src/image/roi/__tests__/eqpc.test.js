import { toBeDeepCloseTo, toMatchCloseTo } from 'jest-matcher-deep-close-to';

import oneRoi from 'test/oneRoi';

expect.extend({ toBeDeepCloseTo, toMatchCloseTo });

describe('ROI eqpc: diameter of a circle of equal projection area', function () {
  it('surface 5', function () {
    let roi = oneRoi`
        010
        111
        010
      `;

    let diameter = roi.eqpc;
    let surface = Math.PI * (diameter / 2) ** 2;

    expect(surface).toBeCloseTo(5);
  });
});
