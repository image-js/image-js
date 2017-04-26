import {Image} from 'test/common';
import {asc as sortAsc} from 'num-sort';
import 'should';

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
        result[0].borderIDs.sort(sortAsc).should.eql([0, 2, 3]);
        result[1].borderIDs.should.eql([1, 3]);
        result[2].borderIDs.should.eql([1, 2]);
    });
});
