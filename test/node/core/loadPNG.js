import {Image, load} from '../common';

describe('Load PNG', function () {
    const tests = [
        // ['name', components, alpha, bitDepth]
        ['grey8', 1, false, 8],
        ['grey16', 1, false, 16],
        ['greya16', 1, true, 8],
        ['greya32', 1, true, 16],
        ['rgb24', 3, false, 8],
        ['rgb48', 3, false, 16],
        ['rgba32', 3, true, 8],
        ['rgba64', 3, true, 16]
    ];

    tests.forEach(function(test) {
        it(test[0], function() {
            return load('format/' + test[0] + '.png').then(function(img) {
                img.components.should.equal(test[1]);
                img.alpha.should.equal(test[2]);
                img.bitDepth.should.equal(test[3]);
            });
        });
    });
});
