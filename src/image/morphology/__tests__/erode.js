import {Image} from 'test/common';
import 'should';
import Matrix from 'ml-matrix';

describe('check the erode function', function () {
    it('check for GREY image 5x5', function () {
        let kernel = new Matrix([[1, 1, 1], [1, 1, 1], [1, 1, 1]]);
        let image = new Image(5, 5,
            [
                255,   0,   255, 255, 255,
                255,   0,   255, 255, 255,
                255,   0,   255, 255, 255,
                255,   0,   255, 255, 255,
                255,   0,   255, 255, 255
            ],
            {kind: 'GREY'}
        );

        Array.from(image.erode({kernel: kernel}).data).should.eql(
            [
                0, 0, 0, 255, 255,
                0, 0, 0, 255, 255,
                0, 0, 0, 255, 255,
                0, 0, 0, 255, 255,
                0, 0, 0, 255, 255
            ]
        );
    });
});

