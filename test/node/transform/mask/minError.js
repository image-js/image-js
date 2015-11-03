import {load} from '../../common';
import minError from '../../../../src/image/transform/mask/minError';

describe('Min Error threshold', function () {
    it('Should work like ImageJ', function () {
        return load('grayscale_by_zimmyrose.png').then(function (img) {
            minError(img.histogram, img.size).should.equal(101);
        });
    });
});
