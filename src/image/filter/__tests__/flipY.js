import {Image} from 'test/common';

describe('flipY', function () {
    it('should flip pixels vertically of all RGBA components', function () {

        let image = new Image(1, 2, [0, 0, 0, 255, 255, 255, 255, 255]);

        let flipped = [255, 255, 255, 255, 0, 0, 0, 255];

        image.flipY();
        image.data.should.eql(flipped);
    });

    it('should flip pixels vertically of GREY image', function () {

        let image = new Image(2, 2, [1, 2, 3, 4],
			{kind: 'GREY'});

        let flipped = [3, 4, 1, 2];

        image.flipY();
        image.data.should.eql(flipped);
    });
});
