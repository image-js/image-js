import { Static } from '../..';
import 'should';

describe('Image core - Algorithms', function () {

    it('check grey names', function () {
        Static.grey.indexOf('hue').should.equal(13);
        Static.mask.indexOf('li').should.equal(4);
        Static.mask.indexOf('threshold').should.equal(0);
    });
});
