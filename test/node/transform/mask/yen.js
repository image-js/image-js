import {load} from '../../common';
import yen from '../../../../src/image/transform/mask/yen';

describe('Yen threshold', function () {
    it('Should work like ImageJ', function () {
        return load('grayscale_by_zimmyrose.png').then(function (img) {
            yen(img.histogram, img.size).should.equal(108);
        });
    });
});