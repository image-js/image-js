import {load, getHash} from 'test/common';

describe('Scale - nearest neighbor', function () {
    it('check images resize', function () {
        let original;
        before(function () {
            return load('resize/5x5a_5.png').then(function (img) {
                original = img;
            });
        });

        const tests = [1, 2, 3, 4, 5, 10, 13, 18];
        tests.forEach(function (test) {
            it(`5x5 -> ${test}x${test}`, function () {
                return load('resize/5x5a_' + test + '.png').then(function (expected) {
                    getHash(original.scale({
                        height: test,
                        width: test
                    })).should.equal(getHash(expected));
                });
            });
        });
    });

});
