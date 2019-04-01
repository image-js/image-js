import { read, Image, ImageKind } from 'ijs';
import { getPath } from 'test';

test('read existing image', async () => {
  const img = await read(getPath('rgba32.png'));
  expect(img).toBeInstanceOf(Image);
  expect(img).toMatchObject({
    width: 30,
    height: 90,
    kind: ImageKind.RGBA
  });
});
