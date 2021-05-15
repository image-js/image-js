import { toBeDeepCloseTo, toMatchCloseTo } from 'jest-matcher-deep-close-to';

import oneRoi from 'test/oneRoi';

expect.extend({ toBeDeepCloseTo, toMatchCloseTo });

describe('perimeterInfo', function () {
  it('roi 4x4', function () {
    let roi = oneRoi`
        0110
        0110
        0110
        0110
      `;

    expect(roi.perimeterInfo).toStrictEqual({
      one: 4,
      two: 4,
      three: 0,
      four: 0,
    });
  });

  it('roi 1 pixel', function () {
    let roi = oneRoi`
        0100
        0000
      `;

    expect(roi.perimeterInfo).toStrictEqual({
      one: 0,
      two: 0,
      three: 0,
      four: 1,
    });
  });

  it('empty square', function () {
    let roi = oneRoi`
        1111
        1001
        1001
        1111
      `;

    expect(roi.perimeterInfo).toStrictEqual({
      one: 8,
      two: 4,
      three: 0,
      four: 0,
    });
  });

  it('a line', function () {
    let roi = oneRoi`
        1
        1
        1
        1
      `;

    expect(roi.perimeterInfo).toStrictEqual({
      one: 0,
      two: 2,
      three: 2,
      four: 0,
    });
  });
});
