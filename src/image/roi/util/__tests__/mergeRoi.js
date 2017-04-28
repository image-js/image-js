
import mergeRoi from '../mergeRoi';
import RoiMap from '../../RoiMap';
import 'should';

describe('Calculate mergeRoi from a roiMap', function () {

    it('work with simple case', function () {
        let map = [
            0, 0, 1, 1, 1, 2,
            1, 1, 1, 1, 2, 2,
            1, 1, 1, 2, 2, 2,
            3, 3, 1, 2, 2, 2,
            3, 3, 3, 3, 2, 2,
            3, 3, 3, 3, 2, 2
        ];

        /*
         Border info:
         '1': { '1': 10, '2': 4, '3': 3 }
         '2': { '1': 4, '2': 11, '3': 2 }
         '3': { '1': 3, '2': 3, '3': 9 }
         */

        let roiMap = new RoiMap({width: 6, height: 6}, map);
        let result = mergeRoi(roiMap, {
            minCommonBorderLength: 4,
            maxCommonBorderLength: 4
        });

        let expected = [
            0, 0, 1, 1, 1, 1,
            1, 1, 1, 1, 1, 1,
            1, 1, 1, 1, 1, 1,
            3, 3, 1, 1, 1, 1,
            3, 3, 3, 3, 1, 1,
            3, 3, 3, 3, 1, 1
        ];
        result.data.should.eql(expected);
    });

    it('should work with complex case', function () {
        let map = [
            -1, -1, 1, 1, 1, 2,
            1, 1, 1, 1, 2, 2,
            1, 1, 1, 2, 2, 2,
            3, 3, 1, 2, 2, 2,
            3, 3, 3, 3, 2, 2,
            3, 3, 3, 3, 2, 2
        ];

        /*
         Border info:
         '1': { '1': 10, '2': 4, '3': 3, '-1': 2 }
         '2': { '1': 4, '2': 11, '3': 2 }
         '3': { '1': 3, '2': 3, '3': 9 }
         '-1': { '1': 3, '-1': 2 }
         */

        let roiMap = new RoiMap({width: 6, height: 6}, map);
        let result = mergeRoi(roiMap, {
            minCommonBorderLength: 3,
            maxCommonBorderLength: 4
        });
        let expected = [
            -1, -1, -1, -1, -1, -1,
            -1, -1, -1, -1, -1, -1,
            -1, -1, -1, -1, -1, -1,
            -1, -1, -1, -1, -1, -1,
            -1, -1, -1, -1, -1, -1,
            -1, -1, -1, -1, -1, -1
        ];

        result.data.should.eql(expected);
    });

    it('should work with more complex case', function () {
        let map = [
            -1, -1, 1, 1, 1, 2,
            1, 1, 1, 1, 2, 2,
            1, 1, 1, 2, 2, 2,
            3, 3, 1, 2, 2, 2,
            3, 3, 3, 3, 2, 2,
            3, 3, 3, 3, 2, 2
        ];

        let roiMap = new RoiMap({width: 6, height: 6}, map);
        let result = mergeRoi(roiMap, {
            minCommonBorderLength: 2,
            maxCommonBorderLength: 2
        });

        let expected = [
            -1, -1, -1, -1, -1, 2,
            -1, -1, -1, -1, 2, 2,
            -1, -1, -1, 2, 2, 2,
            2, 2, -1, 2, 2, 2,
            2, 2, 2, 2, 2, 2,
            2, 2, 2, 2, 2, 2
        ];

        result.data.should.eql(expected);
    });
});
