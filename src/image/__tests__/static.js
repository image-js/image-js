import { Static } from '../..';

describe('Image core - Algorithms', function () {

  it('check grey names', function () {
    expect(Static.grey.indexOf('hue')).toBe(13);
    expect(Static.mask.indexOf('li')).toBe(4);
    expect(Static.mask.indexOf('threshold')).toBe(0);
  });
});
