import RoiMap from '../../RoiMap';
import commonBorderLength from '../commonBorderLength';

describe('Calculate the commonBorderLength from a roiMap', function () {
  it('check simple roimap', function () {
    // prettier-ignore
    const map = [
      0, 0, 1, 1, 1, 2,
      1, 1, 1, 1, 2, 2,
      1, 1, 1, 2, 2, 2,
      3, 3, 1, 2, 2, 2,
      3, 3, 3, 3, 2, 2,
      3, 3, 3, 3, 2, 2,
    ];

    const roiMap = new RoiMap({ width: 6, height: 6 }, map);
    const result = JSON.parse(JSON.stringify(commonBorderLength(roiMap)));

    expect(result).toStrictEqual({
      1: { 1: 10, 2: 4, 3: 3 },
      2: { 1: 4, 2: 11, 3: 2 },
      3: { 1: 3, 2: 3, 3: 9 },
    });
  });

  it('check roimap with positive and negative values', function () {
    // prettier-ignore
    const map = [
      -1, -1, 1, 1, 1, 2,
      1, 1, 1, 1, 2, 2,
      1, 1, 1, 2, 2, 2,
      3, 3, 1, 2, 2, 2,
      3, 3, 3, 3, 2, 2,
      3, 3, 3, 3, 2, 2,
    ];

    const roiMap = new RoiMap({ width: 6, height: 6 }, map);
    const result = JSON.parse(JSON.stringify(commonBorderLength(roiMap)));

    expect(result).toStrictEqual({
      1: { 1: 10, 2: 4, 3: 3, '-1': 2 },
      2: { 1: 4, 2: 11, 3: 2 },
      3: { 1: 3, 2: 3, 3: 9 },
      '-1': { 1: 3, '-1': 2 },
    });
  });
});
