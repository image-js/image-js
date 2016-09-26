import IJS from '..';

describe('IJS.Shape', function () {

    it('we should be able to create a Shape', function () {
        let shape = new IJS.Shape({shape:'circle', filled: false, size: 5});
        let mask = shape.getMask();
        Array.from(mask.data).should.eql([
            0b00100010,
            0b10100010,
            0b10100010,
            0b00000000
        ]);
    });
});
