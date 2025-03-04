import { encode } from '../encode.js';
import { encodeDataURL } from '../encodeDataURL.js';

test('basic image (png)', () => {
  const image = testUtils.createGreyImage([
    [0, 0, 0, 0, 0],
    [0, 255, 255, 255, 0],
    [0, 255, 0, 255, 0],
    [0, 255, 255, 255, 0],
    [255, 0, 255, 0, 255],
  ]);
  const base64Url = encodeDataURL(image);

  expect(base64Url).toBe(
    'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAUAAAAFCAAAAACoBHk5AAAAFklEQVR4XmNggID///+DSCCEskHM/wCAnQr2TY5mOAAAAABJRU5ErkJggg==',
  );
});

test('basic image 2 (jpeg)', () => {
  const image = testUtils.createGreyImage([
    [255, 255, 255, 255, 255],
    [255, 0, 0, 0, 255],
    [255, 0, 0, 0, 255],
    [255, 0, 0, 0, 255],
    [255, 255, 255, 255, 255],
  ]);
  const format = 'jpeg';
  const base64 = encodeDataURL(image, { format });
  const base64Data = Buffer.from(encode(image, { format })).toString('base64');
  expect(typeof base64).toBe('string');
  expect(base64Data).toMatchSnapshot();
});

test('legacy image-js test', () => {
  const image = testUtils.createRgbaImage(
    ` 
        255 0 0 / 255 | 0  255  0 / 255 | 0 0 255 / 255 
        255 255 0 / 255   | 255 0 255 / 255 | 0 255 255 / 255
        0 0 0 / 255 | 255 255 255 / 255 | 127 127 127 / 255 
     `,
  );
  const format = 'jpeg';
  const url = encodeDataURL(image, { format });
  const base64Data = Buffer.from(encode(image, { format })).toString('base64');
  expect(typeof url).toBe('string');
  expect(base64Data).toBe(url.slice(url.indexOf(',') + 1));
});
