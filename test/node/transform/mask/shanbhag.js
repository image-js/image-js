import {load} from '../../common';
import shanbhag from '../../../../src/image/transform/mask/shanbhag';

describe('Shanbhag threshold', function () {
    it('Should work like ImageJ', function () {
        return load('grayscale_by_zimmyrose.png').then(function (img) {
            shanbhag(img.histogram, img.size).should.equal(116);
        });
    });
});
