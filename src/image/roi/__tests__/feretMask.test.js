import { toBeDeepCloseTo, toMatchCloseTo } from 'jest-matcher-deep-close-to';
import oneRoi from 'test/oneRoi';
import binary from 'test/binary';

expect.extend({ toBeDeepCloseTo, toMatchCloseTo });

describe('FeretMask', function () {
  it('roi 4x4', function () {
    let roi = oneRoi`
        0110
        0110
        0110
        0110
      `;

    const mask = roi.getMask({ kind: 'feret' });

    let expected = binary`
    11
    10
    01
    01
  `;

    expect(Array.from(mask.data)).toStrictEqual(Array.from(expected.data));
  });
});
