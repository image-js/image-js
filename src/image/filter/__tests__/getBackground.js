import {Image} from 'test/common';

describe('getBackground filter', function () {
    it('grey image with 0 values', function () {
        let image = new Image(3, 3,
            [
                0, 0, 0,
                0, 0, 0,
                0, 0, 0
            ],
            {kind: 'GREY'}
        );
        let bg = image.getBackground([[0, 0], [1, 1]], [[0], [0]]);
        Array.from(bg.data).should.eql([
            0, 0, 0,
            0, 0, 0,
            0, 0, 0
        ]);
    });
});
