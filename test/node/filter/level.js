import {Image} from '../common';

describe('level', function() {
    describe('extend the image to cover all levels', function () {
        it('should reach the borders and not touch alpha', function () {

            let image = new Image(1,3,[0, 10, 255, 100, 0, 20, 255, 255, 0, 30, 255, 255]);

            let leveled = [0, -0, 255, 100, 0, 128, 255, 255, 0, 255, 255, 255];

            image.level();
            image.data.should.eql(leveled);

        });

        it('should not change if it used the full range', function () {

            let image = new Image(1,3,[0, 0, 0, 255, 100, 110, 120, 255, 255, 255, 255, 255]);

            let leveled = [-0, -0, -0, 255, 100, 110, 120, 255, 255, 255, 255, 255];

            image.level();
            image.data.should.eql(leveled);

        });

    });
});

