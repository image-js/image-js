import {load} from 'test/common';
import {methods} from '../maskAlgorithms';

// if the values are the same as in imageJ we consider it as currently correct
// TODO not obivious that those algorithms can deal with 16 bits images !

/*
Here are the results from imageJ

 Default: 134
 Huang: 134
 Intermodes: 166
 IsoData: 135
 Li: 115
 MaxEntropy: 126
 Mean: 106
 MinError(I): 101
 Minimum: 234
 Moments: 127
 Otsu: 135
 Percentile: 90
 RenyiEntropy: 115
 Shanbhag: 116
 Triangle: 87
 Yen: 108
*/


describe('Threshold calculation', function () {
    it.skip('Huang should work like ImageJ', function () {
        return load('grayscale_by_zimmyrose.png').then(function (img) {
            methods.huang(img.histogram).should.equal(134);
        });
    });

    it('Intermodes should work like ImageJ', function () {
        return load('grayscale_by_zimmyrose.png').then(function (img) {
            methods.intermodes(img.histogram).should.equal(166);
        });
    });

    it('Isodata should work like ImageJ', function () {
        return load('grayscale_by_zimmyrose.png').then(function (img) {
            methods.isodata(img.histogram).should.equal(135);
        });
    });

    it('Percentile should work like ImageJ', function () {
        return load('grayscale_by_zimmyrose.png').then(function (img) {
            methods.percentile(img.histogram).should.equal(90);
        });
    });

    it.skip('Li should work like ImageJ', function () {
        return load('grayscale_by_zimmyrose.png').then(function (img) {
            methods.li(img.histogram).should.equal(115);
        });
    });

    it.skip('MaxEntropy should work like ImageJ', function () {
        return load('grayscale_by_zimmyrose.png').then(function (img) {
            methods.maxEntropy(img.histogram).should.equal(126);
        });
    });

    it.skip('Mean should work like ImageJ', function () {
        return load('grayscale_by_zimmyrose.png').then(function (img) {
            methods.mean(img.histogram).should.equal(106);
        });
    });

    it.skip('MinError should work like ImageJ', function () {
        return load('grayscale_by_zimmyrose.png').then(function (img) {
            methods.minError(img.histogram).should.equal(101);
        });
    });

    it('Minimum should work like ImageJ', function () {
        return load('grayscale_by_zimmyrose.png').then(function (img) {
            methods.minimum(img.histogram).should.equal(234);
        });
    });

    it.skip('Moments should work like ImageJ', function () {
        return load('grayscale_by_zimmyrose.png').then(function (img) {
            methods.moments(img.histogram).should.equal(127);
        });
    });

    it.skip('Otsu should work like ImageJ', function () {
        return load('grayscale_by_zimmyrose.png').then(function (img) {
            methods.otsu(img.histogram).should.equal(135);
        });
    });

    it('Percentile should work like ImageJ', function () {
        return load('grayscale_by_zimmyrose.png').then(function (img) {
            methods.percentile(img.histogram).should.equal(90);
        });
    });

    it.skip('RenyiEntropy should work like ImageJ', function () {
        return load('grayscale_by_zimmyrose.png').then(function (img) {
            methods.renyiEntropy(img.histogram).should.equal(115);
        });
    });

    it.skip('Shanbhag should work like ImageJ', function () {
        return load('grayscale_by_zimmyrose.png').then(function (img) {
            methods.shanbhag(img.histogram).should.equal(116);
        });
    });

    it('Triangle should work like ImageJ', function () {
        return load('grayscale_by_zimmyrose.png').then(function (img) {
            methods.triangle(img.histogram).should.equal(87);
        });
    });

    it.skip('Yem should work like ImageJ', function () {
        return load('grayscale_by_zimmyrose.png').then(function (img) {
            methods.yen(img.histogram).should.equal(108);
        });
    });
});

