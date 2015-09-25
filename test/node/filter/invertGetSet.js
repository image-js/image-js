import {Image} from '../common';

describe('invertGetSet', function () {


    describe('invert 3 components', function () {
        it('should invert colors, not alpha', function () {

            let image = new Image(1,2,[230, 83, 120, 255, 100, 140, 13, 240]);

            let inverted = [25, 172, 135, 255, 155, 115, 242, 240];

            image.invertGetSet();
            image.data.should.eql(inverted);

        });
    });

    describe('invert binary image', function () {
        it('should invert a binary image', function () {
            let image = new Image(8,1,{
                kind: 'BINARY'
            });
            image.setBitXY(0,0);
            let inverted = new Uint8Array(1);
            inverted[0] = 127;

            image.invertGetSet();
            image.data.should.eql(inverted);
        });
    });
});

