import { css2array, getDistinctColors } from '../color';

describe('check color class', function () {
  it('check css2array', function () {
    expect(css2array('red')).toStrictEqual([255, 0, 0, 255]);
  });
  it('check getDistinctColors', function () {
    expect(getDistinctColors(4)).toStrictEqual([
      [230, 0, 0],
      [153, 255, 51],
      [128, 255, 255],
      [76, 0, 153]
    ]);
  });
});
