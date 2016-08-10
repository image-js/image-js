import {Image} from '../common';


describe('Get the ids of neighbour touching the ROI', function () {

    let map = [
        0,0,1,1,1,2,
        1,1,1,1,2,2,
        1,1,1,2,2,2,
        3,3,1,2,2,2,
        3,3,3,3,2,2,
        3,3,3,3,2,2
    ];

    let img = new Image(6, 6);

    let roiManager = img.getROIManager();
    roiManager.putMap(map);
    it('IDs of neighbour', function () {
        let result = roiManager.getROI();
        result[0].neighboursID.should.eql([0, 2, 3]);
        result[1].neighboursID.should.eql([1, 3]);
        result[2].neighboursID.should.eql([1, 2]);
    });
});
