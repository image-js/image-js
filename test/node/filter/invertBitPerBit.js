import {Image} from '../common';

describe('invert binary image bit by bit', function () {
    it('should invert a binary image', function () {
        let image = new Image(8,1,{
            kind: 'BINARY'
        });
        image.setBitXY(0,0);
        let inverted = new Uint8Array(1);
        inverted[0] = 127;

        image.invertBinaryLoop();
        image.data.should.eql(inverted);
    });
});
