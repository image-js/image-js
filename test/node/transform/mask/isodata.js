import {load} from '../../common';
import isodata from '../../../../src/image/transform/mask/isodata';

describe('Isodata threshold', function () {
    it('Should work like ImageJ', function () {
        return load('grayscale_by_zimmyrose.png').then(function (img) {
            isodata(img.histogram).should.equal(135);
        });
    });
});
