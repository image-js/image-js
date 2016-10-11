import {Image} from 'test/common';

describe('flipX', function () {
    it('should flip pixels horizontally of all RGBA components', function () {

        let image = new Image(2, 1, [0, 0, 0, 255, 255, 255, 255, 255]);

        let flipped = [255, 255, 255, 255, 0, 0, 0, 255];

        image.flipX();
        image.data.should.eql(flipped);
    });

    it('should flip pixels horizontally of GREY image', function () {

        let image = new Image(2, 2, [1, 2, 3, 4],
			{kind: 'GREY'});

        let flipped = [2, 1, 4, 3];

        image.flipX();
        image.data.should.eql(flipped);
    });
});
