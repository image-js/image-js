import {Image} from '../common';


describe('Get the number of pixels touching the adjacent zones', function () {

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
    it('Number of pixels adjacent to another zone', function () {
        let result = roiManager.getROI();
        result[0].externalLengths.sort().should.eql([2, 3, 4]);
        result[1].externalLengths.sort().should.eql([2, 4]);
        result[2].externalLengths.sort().should.eql([3, 3]);
    });
});
