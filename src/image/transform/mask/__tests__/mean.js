import {load} from 'test/common';
import mean from '../mean';
import 'should';

describe('Mean threshold', function () {
    it('Should work like ImageJ', function () {
        return load('grayscale_by_zimmyrose.png').then(function (img) {
            mean(img.histogram, img.size).should.equal(106);
        });
    });
});
