import { css2array, getDistinctColors } from '../color';
import 'should';

describe('check color class', function () {
    it('check css2array', function () {
        css2array('red').should.eql([255, 0, 0, 255]);
    });
    it('check getDistinctColors', function () {
        getDistinctColors(4).should.eql(
            [
                [230, 0, 0],
                [153, 255, 51],
                [128, 255, 255],
                [76, 0, 153]
            ]
        );
    });
});
