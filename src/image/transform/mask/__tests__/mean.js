import { load } from 'test/common';

import mean from '../mean';

describe('Mean threshold', function () {
  it('Should work like ImageJ', async () => {
    const img = await load('grayscale_by_zimmyrose.png');
    expect(mean(img.histogram, img.size)).toBe(106);
  });
});
