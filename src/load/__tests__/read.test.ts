import { Image } from '../../Image.js';
import { read } from '../read.js';

test('read existing image', async () => {
  const img = await read(testUtils.getPath('formats/rgba32.png'));
  expect(img).toBeInstanceOf(Image);
  expect(img).toMatchObject({
    width: 30,
    height: 90,
    colorModel: 'RGBA',
  });
});
