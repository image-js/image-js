import { toBeDeepCloseTo, toMatchCloseTo } from 'jest-matcher-deep-close-to';
import oneRoi from 'test/oneRoi';

expect.extend({ toBeDeepCloseTo, toMatchCloseTo });

describe('ROI sphericity', function () {
  it('square', function () {
    let roi = oneRoi`
        11111
        11111
        11111
        11111
        11111
      `;

    expect(roi.sphericity).toBeCloseTo(1.0038, 3);
  });

  it('square cut corner', function () {
    let roi = oneRoi`
        01110
        11111
        11111
        11111
        01110
      `;

    expect(roi.sphericity).toBeCloseTo(1.0608, 3);
  });

  it('diamond', function () {
    let roi = oneRoi`
        00100
        01110
        11111
        01110
        00100
      `;
    expect(roi.sphericity).toBeCloseTo(0.9854, 3);
  });
});
