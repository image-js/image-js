import {load} from '../../common';
import li from '../../../../src/image/transform/mask/li';

describe('Li threshold', function () {
    it('Should work like ImageJ', function () {
        return load('grayscale_by_zimmyrose.png').then(function (img) {
            li(img.histogram, img.size).should.equal(117);
        });
    });
});
