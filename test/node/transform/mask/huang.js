import {load} from '../../common';
import huang from '../../../../src/image/transform/mask/huang';

describe('Huang threshold', function () {
    it('Should work like ImageJ', function () {
        return load('grayscale_by_zimmyrose.png').then(function (img) {
            huang(img.histogram).should.equal(132);
        });
    });
});
