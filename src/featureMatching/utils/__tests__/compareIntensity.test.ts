import { expect, test } from 'vitest';

import { Image } from '../../../Image.js';
import { compareIntensity } from '../compareIntensity.js';

test('verify descriptor is correct (descriptorLength = 10)', () => {
  const size = 5;
  const image = new Image(size, size, { colorModel: 'GREY' });
  for (let i = 0; i < 2 * size; i++) {
    image.setPixelByIndex(i, [255]);
  }
  const p1 = { column: 0, row: 0 };
  const p2 = { column: -1, row: -2 };

  expect(compareIntensity(image, p1, p2)).toBe(true);
  expect(compareIntensity(image, p2, p1)).toBe(false);
});
