import {Image} from 'test/common';
import 'should';

describe('we check paintPolygons', function () {
    it('should yield the painted image with 2 boxes', function () {
        let size = 5;
        let data = new Array(size * size * 3).fill(0);
        let image = new Image(size, size, data, {kind: 'RGB'});

        let polygons = [[[1, 0], [3, 0], [3, 2], [1, 2]], [[1, 3], [3, 3], [3, 4], [1, 4]]];
        image.paintPolygons(polygons, {colors: ['red'], filled: true});

        let grey = image.grey();

        let expected = [
            0, 54, 54, 54, 0,
            0, 54, 54, 54, 0,
            0, 54, 54, 54, 0,
            0, 54, 54, 54, 0,
            0, 54, 54, 54, 0
        ];

        Array.from(grey.data).should.eql(expected);
    });
});

