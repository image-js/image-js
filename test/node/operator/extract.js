import {Image, load} from '../common';
import {getHash} from 'ij-test';


describe('we check we can extract a part of B/W image', function () {
    it('check the extract without specify position', function () {
        let mask=new Image(2,2,{
            kind: 'BINARY'
        });
        mask.setBitXY(0,0);
        mask.setBitXY(1,1);

        return load('BW4x4.png').then(function (image) {
            (function() {
                image.extract(mask);
            }).should.throw(/can not extract an image/);

        });
    });

    it('check by specify 1,1 position with parent', function () {

        return load('BW4x4.png').then(function (image) {

            let mask = new Image(2, 2, {
                kind: 'BINARY',
                position: [1, 1],
                parent: image
            });

            mask.setBitXY(0, 0);
            mask.setBitXY(1, 0);

            let extract = image.extract(mask);
            getHash(image).should.equal(getHash(extract.parent));
            extract.width.should.equal(2);
            extract.height.should.equal(2);
            Array.from(extract.data).should.eql([
                0, 0, 0, 255,
                255, 255, 255, 255,
                255, 255, 255, 0,
                255, 255, 255, 0
            ]);
        });
    });
});



