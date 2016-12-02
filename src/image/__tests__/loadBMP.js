import {load} from 'test/common';

describe.only('Load TIFF', function () {
    const tests = [
        // ['name', components, alpha, bitDepth]
        ['binary1', 1, 0, 1],
        ['grey8', 1, 0, 8],
        ['rgb24', 3, 0, 8]
    ];

    tests.forEach(function (test) {
        it(test[0], function () {
            return load('format/bmp/' + test[0] + '.bmp').then(function (img) {
                // img.components.should.equal(test[1]);
                // img.alpha.should.equal(test[2]);
                // img.bitDepth.should.equal(test[3]);
            });
        });
    });
});
