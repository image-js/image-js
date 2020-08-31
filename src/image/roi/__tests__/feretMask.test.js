import { toBeDeepCloseTo, toMatchCloseTo } from 'jest-matcher-deep-close-to';
import binary from 'test/binary';
import oneRoi from 'test/oneRoi';

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
    111
    010
    010
    001
    001
  `;

    expect(Array.from(mask.data)).toStrictEqual(Array.from(expected.data));
  });
});
