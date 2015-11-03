import {load} from '../../common';
import maxEntropy from '../../../../src/image/transform/mask/maxEntropy.js';

describe('Max Entropy threshold', function () {
    it('Should work like ImageJ', function () {
        return load('grayscale_by_zimmyrose.png').then(function (img) {
            maxEntropy(img.histogram, img.size).should.equal(126);
        });
    });
});