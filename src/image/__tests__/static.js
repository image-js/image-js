import {IJS} from 'test/common';

describe('Image core - Algorithms', function () {

    it('check grey names', function () {
        IJS.Static.grey.indexOf('hue').should.equal(13);
        IJS.Static.mask.indexOf('li').should.equal(4);
        IJS.Static.mask.indexOf('threshold').should.equal(0);
    });
});
