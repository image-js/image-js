import { Image } from 'test/common';

/* Image to test:
0011
1111
1100
0100
 */
describe('Get the maxLength of the Roi and the points', function () {
  let data = new Uint8Array(2);
  data[0] = 63;
  data[1] = 196;

  let mask = new Image(4, 4, data, {
    kind: 'BINARY'
  });

  let roiManager = mask.getRoiManager();
  roiManager.fromMask(mask);
  it('vectors X and Y', function () {
    let results = roiManager.getRois();
    expect(results[0].points.slice(0, 3)).toStrictEqual([[2, 0], [3, 0], [0, 1]]);
  });


  it('maxLengthPoints', function () {
    let result = roiManager.getRois();
    expect(result[0].maxLengthPoints).toStrictEqual([[3, 0], [1, 3]]);
  });

  it('maxLength', function () {
    let result = roiManager.getRois();
    expect(result[0].maxLength).toBe(Math.sqrt(13));
  });
});
