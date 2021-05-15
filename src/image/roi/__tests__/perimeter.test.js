import { toBeDeepCloseTo, toMatchCloseTo } from 'jest-matcher-deep-close-to';

import oneRoi from 'test/oneRoi';

expect.extend({ toBeDeepCloseTo, toMatchCloseTo });

describe('perimeter', function () {
  it('roi 4x4', function () {
    let roi = oneRoi`
        0110
        0110
        0110
        0110
      `;

    expect(roi.perimeter).toBeCloseTo(9.656, 2);
  });

  it('roi 1 pixel', function () {
    let roi = oneRoi`
        0100
        0000
      `;

    expect(roi.perimeter).toBeCloseTo(3.414, 2);
  });

  it('empty square', function () {
    let roi = oneRoi`
        1111
        1001
        1001
        1111
      `;

    expect(roi.perimeter).toBeCloseTo(13.656, 2);
  });

  it('a line', function () {
    let roi = oneRoi`
        1
        1
        1
        1
      `;

    expect(roi.perimeter).toBeCloseTo(6.485, 2);
  });
});
