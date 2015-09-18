import {Image} from '../common';

describe.only('level', function() {
    describe('extend the image to cover all levels', function () {
        it('should reach the borders and not touch alpha', function () {

            let image = new Image(1,3,[0, 10, 255, 100, 0, 20, 255, 255, 0, 30, 255, 255]);


            let leveled = [0, 0, 255, 100, 0, 127, 255, 255, 0, 255, 255, 255];

            image.level();
            image.data.should.eql(leveled);

        });
    });
});

