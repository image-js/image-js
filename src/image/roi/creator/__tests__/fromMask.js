import fromMask from '../fromMask';
import {Image} from 'test/common';

describe('we check fromMask', function () {

    /*
     We will create the following mask
      ______
     | x x x|
     |  xx x|
     | x  x |
     |     x|
     | xxx  |
     |      |
     */

    let mask = new Image(6, 6, {kind: 'BINARY'});
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
        let mapData = fromMask(mask).data;

        const expected = [
            -1,  1, -2,  4, -3,  6,
            -1, -1,  4,  4, -3,  6,
            -1,  2, -1, -1,  5, -4,
            -1, -1, -1, -1, -1,  7,
            -1,  3,  3,  3, -1, -1,
            -1, -1, -1, -1, -1, -1
        ];

        Array.from(mapData).should.eql(expected);
    });

    it('should yield the right map with 8 neighbours', function () {
        let mapData = fromMask(mask, {allowCorners: true}).data;

        const expected = [
            -1,  1, -1,  1, -1,  1,
            -1, -1,  1,  1, -1,  1,
            -1,  1, -1, -1,  1, -1,
            -1, -1, -1, -1, -1,  1,
            -1,  2,  2,  2, -1, -1,
            -1, -1, -1, -1, -1, -1
        ];

        Array.from(mapData).should.eql(expected);
    });
});
