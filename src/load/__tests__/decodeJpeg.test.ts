import { expect, test } from 'vitest';

import { decodeJpeg } from '../decodeJpeg.ts';

const tests = [['grey6'], ['grey12'], ['rgb6'], ['rgb12']] as const;

test.each(tests)('should load from buffer %s', (name) => {
  const buffer = testUtils.loadBuffer(`formats/${name}.jpg`);
  const img = decodeJpeg(buffer);

  expect(img.colorModel).toBe('RGBA');
  expect(img.bitDepth).toBe(8);
});
