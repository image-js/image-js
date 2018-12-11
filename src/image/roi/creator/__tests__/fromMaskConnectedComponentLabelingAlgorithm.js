import { Image } from 'test/common';

import fromMaskConnectedComponentLabelingAlgorithm from '../fromMaskConnectedComponentLabelingAlgorithm';

describe('we check fromMask2', function () {
  /*
     We will create the following mask
      ______
     | x x x|
     |  xx x|
     | x  x |
     |     x|
     | xxx  |
     |      |
      ‾‾‾‾‾‾

     */
  let mask = new Image(6, 6, { kind: 'BINARY' });
  mask.setBitXY(1, 0);
  mask.setBitXY(3, 0);
  mask.setBitXY(3, 1);
  mask.setBitXY(5, 0);
  mask.setBitXY(2, 1);
  mask.setBitXY(5, 1);
  mask.setBitXY(1, 2);
  mask.setBitXY(4, 2);
  mask.setBitXY(5, 3);
  mask.setBitXY(1, 4);
  mask.setBitXY(2, 4);
  mask.setBitXY(3, 4);

  it('should yield the right map with 4 neighbours', function () {
    let mapData = fromMaskConnectedComponentLabelingAlgorithm(mask).data;

    const expected = [
      0, 1, 0, 2, 0, 3,
      0, 0, 2, 2, 0, 3,
      0, 5, 0, 0, 6, 0,
      0, 0, 0, 0, 0, 7,
      0, 8, 8, 8, 0, 0,
      0, 0, 0, 0, 0, 0
    ];

    expect(Array.from(mapData)).toStrictEqual(expected);
  });

  it('should yield the right map with 8 neighbours', function () {
    let mapData = fromMaskConnectedComponentLabelingAlgorithm(mask, { allowCorners: true }).data;

    const expected = [
      0, 1, 0, 1, 0, 1,
      0, 0, 1, 1, 0, 1,
      0, 1, 0, 0, 1, 0,
      0, 0, 0, 0, 0, 1,
      0, 4, 4, 4, 0, 0,
      0, 0, 0, 0, 0, 0
    ];

    expect(Array.from(mapData)).toStrictEqual(expected);
  });
});
