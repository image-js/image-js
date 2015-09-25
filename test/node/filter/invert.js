import {Image} from '../common';

describe('invert', function () {
    it('should invert colors of 3 components of RGBA, not alpha', function () {

        let image = new Image(1,2,[230, 83, 120, 255, 100, 140, 13, 240]);

        let inverted = [25, 172, 135, 255, 155, 115, 242, 240];

        image.invert();
        image.data.should.eql(inverted);

    });

    it('should invert grey of GREY image', function () {

        let image = new Image(2,2,[1, 2, 3, 4],
            {kind: 'GREY'});

        let inverted = [254, 253, 252, 251];

        image.invert();
        image.data.should.eql(inverted);

    });

    it('should invert grey 16 bits of GREY image', function () {

        let image = new Image(2,2,[1, 2, 3, 4],
            {kind: 'GREY', bitDepth: 16});

        let inverted = [65534, 65533, 65532, 65531];

        image.invert();
        image.data.should.eql(inverted);

    });

    it('should invert data if BINARY image', function () {

        let data = new Uint8Array(1);
        data[0] = 85;

        let image = new Image(2, 4,data,
            {kind: 'BINARY'});

        let inverted = new Uint8Array(1);
        inverted[0] = [170];

        image.invert();
        image.data.should.eql(inverted);

    });


});

