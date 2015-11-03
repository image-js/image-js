import {load} from '../../common';
import triangle from '../../../../src/image/transform/mask/triangle';

describe('Triangle threshold', function () {
    it('Should work like ImageJ', function () {
        return load('grayscale_by_zimmyrose.png').then(function (img) {
            triangle(img.histogram).should.equal(87);
        });
    });
});
