import { toBeDeepCloseTo, toMatchCloseTo } from 'jest-matcher-deep-close-to';
import binary from 'test/binary';
import oneRoi from 'test/oneRoi';

expect.extend({ toBeDeepCloseTo, toMatchCloseTo });

describe('mbrContour mask', function () {
  it('roi 4x4 rectangle', function () {
    let roi = oneRoi`
        0110
        0110
        0110
        0110
      `;

    const mask = roi.getMask({ kind: 'mbrContour' });

    let expected = binary`
    111
    101
    101
    101
    111
  `;

    expect(Array.from(mask.data)).toStrictEqual(Array.from(expected.data));
  });
});
