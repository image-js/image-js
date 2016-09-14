import ROIMapper from '../fromExtrema';
import {Image} from 'test/common';



describe('we check createROIMapFromMaxima only looking for top', function () {
    it('should yield the right map large top', function () {
        let image = new Image(5, 5,
            [
                0, 0, 0, 0, 0,
                0, 3, 1, 1, 1,
                0, 1, 4, 4, 2,
                0, 1, 4, 4, 3,
                0, 1, 2, 3, 3
            ],
            {kind: 'GREY'}
        );

        let pixels = ROIMapper.call(image,
            {onlyTop:true}
        ).pixels;

        Array.from(pixels).should.eql([
            0, 0, 0, 0, 0,
            0, 0, 0, 0, 0,
            0, 0, 1, 1, 0,
            0, 0, 1, 1, 0,
            0, 0, 0, 0, 0
        ]);
    });

    it('should yield the right map NO top', function () {
        let image = new Image(5, 5,
            [
                0, 0, 0, 5, 0,
                0, 3, 1, 1, 1,
                0, 1, 4, 4, 2,
                0, 1, 4, 4, 3,
                0, 1, 2, 3, 5
            ],
            {kind: 'GREY'}
        );

        let pixels = ROIMapper.call(image,
            {onlyTop:true}
        ).pixels;

        Array.from(pixels).should.eql([
            0, 0, 0, 0, 0,
            0, 0, 0, 0, 0,
            0, 0, 0, 0, 0,
            0, 0, 0, 0, 0,
            0, 0, 0, 0, 0
        ]);
    });

    it('should yield the right map 2 tops', function () {
        let image = new Image(5, 5,
            [
                0, 0, 0, 0, 0,
                0, 3, 1, 1, 1,
                0, 1, 1, 4, 2,
                0, 1, 4, 4, 3,
                0, 1, 2, 3, 3
            ],
            {kind: 'GREY'}
        );

        let pixels = ROIMapper.call(image,
            {onlyTop:true}
        ).pixels;

        Array.from(pixels).should.eql([
            0, 0, 0, 0, 0,
            0, 1, 0, 0, 0,
            0, 0, 0, 2, 0,
            0, 0, 2, 2, 0,
            0, 0, 0, 0, 0
        ]);
    });

    it('should yield the right map symmetric', function () {

        let image = new Image(5, 5,
            [
                0, 0, 0, 0, 0,
                0, 1, 1, 1, 0,
                0, 1, 0, 0, 0,
                0, 1, 0, 2, 2,
                0, 0, 0, 2, 2
            ],
            {kind: 'GREY'}
        );

        let pixels = ROIMapper.call(image,
            {onlyTop:true}
        ).pixels;

        Array.from(pixels).should.eql([
            0, 0, 0, 0, 0,
            0, 1, 1, 1, 0,
            0, 1, 0, 0, 0,
            0, 1, 0, 0, 0,
            0, 0, 0, 0, 0
        ]);
    });
});


describe('we check createROIMapFromMaxima only looking for maxima', function () {
    it('should yield the right map large top', function () {
        let image = new Image(5, 5,
            [
                0, 0, 0, 0, 0,
                0, 3, 1, 1, 1,
                0, 1, 4, 4, 2,
                0, 1, 4, 4, 3,
                0, 1, 2, 3, 3
            ],
            {kind: 'GREY'}
        );

        let pixels = ROIMapper.call(image,
            {}
        ).pixels;

        Array.from(pixels).should.eql([
            1, 1, 1, 1, 1,
            1, 1, 1, 1, 1,
            1, 1, 1, 1, 1,
            1, 1, 1, 1, 1,
            1, 1, 1, 1, 1
        ]);
    });

    it('should yield the right map one roi', function () {
        let image = new Image(5, 5,
            [
                0, 0, 0, 5, 0,
                0, 0, 0, 0, 0,
                0, 0, 4, 4, 2,
                0, 0, 4, 4, 3,
                0, 0, 2, 3, 3
            ],
            {kind: 'GREY'}
        );

        let pixels = ROIMapper.call(image).pixels;

        Array.from(pixels).should.eql([
            1, 1, 1, 0, 1,
            1, 1, 1, 1, 1,
            1, 1, 1, 1, 1,
            1, 1, 1, 1, 1,
            1, 1, 1, 1, 1
        ]);
    });

    it.skip('should yield the right map 2 roi', function () {
        let image = new Image(5, 5,
            [
                0, 0, 0, 0, 0,
                0, 3, 0, 0, 0,
                0, 0, 0, 4, 0,
                0, 0, 4, 4, 0,
                0, 0, 0, 0, 0
            ],
            {kind: 'GREY'}
        );

        let pixels = ROIMapper.call(image).pixels;

        Array.from(pixels).should.eql([
            1, 1, 1, 1, 1,
            1, 1, 1, 2, 2,
            1, 1, 1, 2, 2,
            1, 2, 2, 2, 2,
            1, 2, 2, 2, 2
        ]);
    });

});
