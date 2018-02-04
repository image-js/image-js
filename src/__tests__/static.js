import { Static } from '..';

describe('Image core - Algorithms', function () {
  it('check grey names', function () {
    expect(Static.grey.hue).toBe('hue');
    expect(Static.threshold.li).toBe('li');
    expect(Static.threshold.threshold).toBeUndefined();
  });
});
