import { expect, test } from 'vitest';

import { fetchURL } from '../fetchURL.js';

test('decodes image from data URL', async () => {
  const image = await fetchURL(
    'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAUAAAAFCAAAAACoBHk5AAAAFklEQVR4XmNggID///+DSCCEskHM/wCAnQr2TY5mOAAAAABJRU5ErkJggg==',
  );

  expect(image.bitDepth).toBe(8);

  expect(image).toMatchImageData(`
      0   0   0   0   0
      0 255 255 255   0
      0 255   0 255   0
      0 255 255 255   0
    255   0 255   0 255
  `);
});
