import { Image } from 'test/common';

import { asc as sortAsc } from 'num-sort';

describe('Get the ids of neighbour touching the Roi', function () {
  let map = [
    0, 0, 1, 1, 1, 2,
    1, 1, 1, 1, 2, 2,
    1, 1, 1, 2, 2, 2,
    3, 3, 1, 2, 2, 2,
    3, 3, 3, 3, 2, 2,
    3, 3, 3, 3, 2, 2
  ];

  let img = new Image(6, 6);

  let roiManager = img.getRoiManager();
  roiManager.putMap(map);
  it('IDs of neighbour', function () {
    let result = roiManager.getRois();
    expect(result[0].borderIDs.sort(sortAsc)).toStrictEqual([0, 2, 3]);
    expect(result[1].borderIDs).toStrictEqual([1, 3]);
    expect(result[2].borderIDs).toStrictEqual([1, 2]);
  });
});
