import { Image } from 'test/common';
import binary from 'test/binary';

describe('we check that each Roi is surrounded by the expected zones', function () {
  const data = binary`
    0011
    1111
    1100
    0000
  `;

  /*
         . . x x  -1 -1 +1 +1
         x x x x  +1 +1 +1 +1
         x x . .  +1 +1 -2 -2
         . . . .  -2 -2 -2 -2
     */

  let mask = new Image(4, 4, data, {
    kind: 'BINARY'
  });

  let roiManager = mask.getRoiManager();
  roiManager.fromMask(mask);

  it('should yield the right boxIDs', function () {
    let result = roiManager.getRois();
    expect(result).toHaveLength(3);

    result.sort(function (a, b) {
      return b.boxIDs[0] - a.boxIDs[0];
    });

    expect(result[0].boxIDs).toStrictEqual([1]);
    expect(result[1].boxIDs).toStrictEqual([1]);
    expect(result[2].boxIDs).toStrictEqual([-1, -2]);
  });

  it('should yield the right borderIDs', function () {
    let result = roiManager.getRois();

    result.sort(function (a, b) {
      return b.borderIDs[0] - a.borderIDs[0];
    });

    expect(result[0].borderIDs).toStrictEqual([1]); // -1
    expect(result[1].borderIDs).toStrictEqual([1]); // -2
    expect(result[2].borderIDs).toStrictEqual([-1, -2]); // +1

    expect(result[0].borderLengths).toStrictEqual([3]);
    expect(result[1].borderLengths).toStrictEqual([4]);
    expect(result[2].borderLengths).toStrictEqual([2, 4]);
  });

  it('should yield the right externalIDs', function () {
    let result = roiManager.getRois();

    result.sort(function (a, b) {
      return b.borderIDs[0] - a.borderIDs[0];
    });

    expect(result[0].externalIDs).toStrictEqual([1]); // -1
    expect(result[1].externalIDs).toStrictEqual([1]); // -2
    expect(result[2].externalIDs).toStrictEqual([-1, -2]); // +1

    expect(result[0].externalLengths).toStrictEqual([3]);
    expect(result[1].externalLengths).toStrictEqual([4]);
    expect(result[2].externalLengths).toStrictEqual([2, 4]);
  });
});
