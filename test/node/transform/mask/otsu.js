import {load} from '../../common';
import otsu from '../../../../src/image/transform/mask/otsu';

describe('Otsu threshold', function () {
    it('Should work like ImageJ', function () {
        return load('grayscale_by_zimmyrose.png').then(function (img) {
            otsu(img.histogram, img.size).should.equal(135);
        });
    });
});
