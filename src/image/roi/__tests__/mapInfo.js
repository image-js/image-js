import { Image } from 'test/common';

/* Image to test:
0011
1111
1100
0000
 */
describe('mark a binary image 4 x 4 in 3 zones and create ROIs', function () {
  it('should yield the right result', function () {
    let data = new Uint8Array(2);
    data[0] = 63;
    data[1] = 192;

    let mask = new Image(4, 4, data, {
      kind: 'BINARY'
    });

    let roiManager = mask.getRoiManager();
    roiManager.fromMask(mask);

    let result = roiManager.getRois();

    result.sort(function (a, b) {
      return a.id - b.id;
    });

    let expected = [
      { id: -2, meanX: 1.8333333333333333, meanY: 2.6666666666666665, minX: 0, maxX: 3, minY: 2, maxY: 3, surface: 6 },
      { id: -1, meanX: 0.5, meanY: 0, minX: 0, maxX: 1, minY: 0, maxY: 0, surface: 2 },
      { id: 1, meanX: 1.5, meanY: 1, minX: 0, maxX: 3, minY: 0, maxY: 2, surface: 8 }
    ];

    expect(result).toHaveLength(3);

    expect(result[0]).toMatchObject(expected[0]);
    expect(result[1]).toMatchObject(expected[1]);
    expect(result[2]).toMatchObject(expected[2]);
  });
});

