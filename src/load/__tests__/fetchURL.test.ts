import { describe, expect, it } from 'vitest';

import { encodeDataURL } from '../../save/encodeDataURL.js';
import { fetchURL } from '../fetchURL.js';

describe('testing fetchURL', () => {
  it('decodes image from data URL', async () => {
    const image = await fetchURL(
      'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAUAAAAFCAAAAACoBHk5AAAAFklEQVR4XmNggID///+DSCCEskHM/wCAnQr2TY5mOAAAAABJRU5ErkJggg==',
    );

    expect(image.bitDepth).toBe(8);
    expect(image.getRawImage().data).toStrictEqual(
      new Uint8Array([
        0, 0, 0, 0, 0, 0, 255, 255, 255, 0, 0, 255, 0, 255, 0, 0, 255, 255, 255,
        0, 255, 0, 255, 0, 255,
      ]),
    );
  });

  it('encoded URL must be equal to decoded one', async () => {
    const dataURL =
      'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAUAAAAFCAAAAACoBHk5AAAAFklEQVR4XmNggID///+DSCCEskHM/wCAnQr2TY5mOAAAAABJRU5ErkJggg==';
    const image = await fetchURL(dataURL);
    const result = encodeDataURL(image);

    expect(result).toStrictEqual(dataURL);
  });
});
