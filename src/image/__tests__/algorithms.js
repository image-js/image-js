import {IJS} from 'test/common';

describe('Image core - Algorithms', function () {

    it('check grey algorithms', function () {
        IJS.Algorithms.grey.indexOf('hue').should.equal(13);
    });
});
