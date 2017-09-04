import {load, getHash} from 'test/common';
import 'should';

describe('Scale - nearest neighbor', function () {
    let original;
    beforeEach(async () => {
        original = await load('resize/5x5a_5.png');
    });

    const tests = [1, 2, 3, 4, 5, 10, 13, 18];
    tests.forEach(function (test) {
        it(`5x5 -> ${test}x${test}`, async () => {
            const expected = await load(`resize/5x5a_${test}.png`);
            getHash(original.scale({
                height: test,
                width: test
            })).should.equal(getHash(expected));
        });
    });
});
