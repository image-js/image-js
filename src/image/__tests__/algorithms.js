import {IJS} from 'test/common';

describe('Image core - Algorithms', function () {

    it.only('check grey names', function () {
        IJS.Algorithms.grey.indexOf('hue').should.equal(13);
        IJS.Algorithms.mask.indexOf('li').should.equal(3);
        IJS.Algorithms.mask.indexOf('threshold').should.equal(15);
    });
});
