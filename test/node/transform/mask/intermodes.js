import {load} from '../../common';
import intermodes from '../../../../src/image/transform/mask/intermodes';

describe('Intermodes threshold', function () {
    it('Should work like ImageJ', function () {
        return load('grayscale_by_zimmyrose.png').then(function (img) {
            intermodes(img.histogram).should.equal(166);
        });
    });
});
