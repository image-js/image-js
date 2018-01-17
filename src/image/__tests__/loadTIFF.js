import { load } from 'test/common';
import 'should';

describe('Load TIFF', function () {
    const tests = [
        // ['name', components, alpha, bitDepth]
        ['grey8', 1, 0, 8],
        ['grey16', 1, 0, 16]
    ];

    tests.forEach(function (test) {
        it(test[0], function () {
            return load(`format/${test[0]}.tif`).then(function (img) {
                img.components.should.equal(test[1]);
                img.alpha.should.equal(test[2]);
                img.bitDepth.should.equal(test[3]);
                img.meta.should.have.properties(['tiff', 'exif']);
            });
        });
    });
});
