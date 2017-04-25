
import mergeRoi from '../mergeRoi';
import RoiMap from '../../RoiMap';

describe.only('Calculate the commonBorderLength from a roiMap', function () {

    let map = [
        0, 0, 1, 1, 1, 2,
        1, 1, 1, 1, 2, 2,
        1, 1, 1, 2, 2, 2,
        3, 3, 1, 2, 2, 2,
        3, 3, 3, 3, 2, 2,
        3, 3, 3, 3, 2, 2
    ];

    let roiMap = new RoiMap({width: 6, height: 6}, map);
    let result = mergeRoi(roiMap, {
        minCommonBorderLength: 3,
        maxCommonBorderLength: 4,
    });

    // console.log(result);

    // result.should.eql(
    //     {
    //         '1': { '2': 4, '3': 3 },
    //         '2': { '1': 4, '3': 2 },
    //         '3': { '1': 3, '2': 3 }
    //     }
    // );
});
