import {Image} from 'test/common';
import 'should';

describe('invert binary image bit by bit', () =>{
    it('should invert a binary image', () =>{
        let image = new Image(8, 1, {
            kind: 'BINARY'
        });
        image.setBitXY(0, 0);
        let inverted = new Uint8Array(1);
        inverted[0] = 127;

        image.invertBinaryLoop();
        expect(image.data).toEqual(inverted);
    });
});
