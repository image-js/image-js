import { Image } from 'test/common';

/* Image to test:
0011
1111
1100
0100
 */
describe('Get the angle of the region, relative to the maxlength', function () {
  let data = new Uint8Array(2);
  data[0] = 63;
  data[1] = 196;

  let mask = new Image(4, 4, data, {
    kind: 'BINARY'
  });

  let roiManager = mask.getRoiManager();
  roiManager.fromMask(mask);
  it('angle', function () {
    let result = roiManager.getRois();
    expect(result[0].angle).toStrictEqual(-Math.atan2(0 - 3, 3 - 1) * 180 / Math.PI);
  });
});
