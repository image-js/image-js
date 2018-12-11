
import RoiMap from '../../RoiMap';

describe('Calculate mergeRoi from a roiMap', function () {
  it('work with simple case', function () {
    let map = [
      0, 0, 1, 1, 1, 2,
      1, 1, 1, 1, 2, 2,
      1, 1, 1, 2, 2, 2,
      3, 3, 1, 2, 2, 2,
      3, 3, 3, 3, 2, 2,
      3, 3, 3, 3, 2, 2
    ];

    /*
         Border info:
         '1': { '1': 10, '2': 4, '3': 3 }
         '2': { '1': 4, '2': 11, '3': 2 }
         '3': { '1': 3, '2': 3, '3': 9 }
         */

    let roiMap = new RoiMap({ width: 6, height: 6 }, map);
    let result = roiMap.mergeRoi({
      minCommonBorderLength: 4,
      maxCommonBorderLength: 4
    });

    let expected = [
      0, 0, 1, 1, 1, 1,
      1, 1, 1, 1, 1, 1,
      1, 1, 1, 1, 1, 1,
      3, 3, 1, 1, 1, 1,
      3, 3, 3, 3, 1, 1,
      3, 3, 3, 3, 1, 1
    ];
    expect(result.data).toStrictEqual(expected);
  });

  it('should work with complex case', function () {
    let map = [
      -1, -1, 1, 1, 1, 2,
      1, 1, 1, 1, 2, 2,
      1, 1, 1, 2, 2, 2,
      3, 3, 1, 2, 2, 2,
      3, 3, 3, 3, 2, 2,
      3, 3, 3, 3, 2, 2
    ];

    /*
         Border info:
         '1': { '1': 10, '2': 4, '3': 3, '-1': 2 }
         '2': { '1': 4, '2': 11, '3': 2 }
         '3': { '1': 3, '2': 3, '3': 9 }
         '-1': { '1': 3, '-1': 2 }
         */

    let roiMap = new RoiMap({ width: 6, height: 6 }, map);
    let result = roiMap.mergeRoi({
      minCommonBorderLength: 3,
      maxCommonBorderLength: 4
    });
    let expected = [
      -1, -1, -1, -1, -1, -1,
      -1, -1, -1, -1, -1, -1,
      -1, -1, -1, -1, -1, -1,
      -1, -1, -1, -1, -1, -1,
      -1, -1, -1, -1, -1, -1,
      -1, -1, -1, -1, -1, -1
    ];

    expect(result.data).toStrictEqual(expected);
  });

  it('should work with more complex case', function () {
    let map = [
      -1, -1, 1, 1, 1, 2,
      1, 1, 1, 1, 2, 2,
      1, 1, 1, 2, 2, 2,
      3, 3, 1, 2, 2, 2,
      3, 3, 3, 3, 2, 2,
      3, 3, 3, 3, 2, 2
    ];

    let roiMap = new RoiMap({ width: 6, height: 6 }, map);
    let result = roiMap.mergeRoi({
      minCommonBorderLength: 2,
      maxCommonBorderLength: 2
    });

    let expected = [
      -1, -1, -1, -1, -1, 2,
      -1, -1, -1, -1, 2, 2,
      -1, -1, -1, 2, 2, 2,
      2, 2, -1, 2, 2, 2,
      2, 2, 2, 2, 2, 2,
      2, 2, 2, 2, 2, 2
    ];

    expect(result.data).toStrictEqual(expected);
  });

  it('check with common border ratio', function () {
    let map = [
      1, 1, 1,
      2, 2, 2,
      3, 3, 0
    ];

    /*
         Border info:
         '1': { '1': 3, '2': 3 }
         '2': { '1': 3, '2': 3, '3': 2 }
         '3': { '2': 2, '3': 2 } }
         */

    let roiMap = new RoiMap({ width: 3, height: 3 }, map);
    let result = roiMap.mergeRoi({
      minCommonBorderRatio: 0.8,
      maxCommonBorderRatio: 1,
      algorithm: 'commonBorderRatio'
    });
    let expected = [
      1, 1, 1,
      1, 1, 1,
      1, 1, 0
    ];
    expect(result.data).toStrictEqual(expected);
  });

  it('check with common border ratio more complex', function () {
    let map = [
      1, 1, 1, 1, 1, 1,
      1, 2, 2, 3, 3, 1,
      1, 2, 2, 3, 3, 1,
      1, 1, 1, 1, 1, 1
    ];

    /*
         Border info:
         '1': { '1': 16, '2': 4, '3': 4 }
         '2': { '1': 6, '2': 4, '3': 2 }
         '3': { '1': 6, '2': 2, '3': 4 }
         */

    let roiMap = new RoiMap({ width: 6, height: 4 }, map);
    let result = roiMap.mergeRoi({
      minCommonBorderRatio: 0.7,
      maxCommonBorderRatio: 0.9,
      algorithm: 'commonBorderRatio'
    });
    let expected = [
      1, 1, 1, 1, 1, 1,
      1, 2, 2, 3, 3, 1,
      1, 2, 2, 3, 3, 1,
      1, 1, 1, 1, 1, 1
    ];
    expect(result.data).toStrictEqual(expected);
  });
});
