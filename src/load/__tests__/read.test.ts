import { read } from '..';
import { Image } from '../../Image';
import { ImageColorModel } from '../../utils/constants/colorModels';

test('read existing image', async () => {
  const img = await read(testUtils.getPath('formats/rgba32.png'));
  expect(img).toBeInstanceOf(Image);
  expect(img).toMatchObject({
    width: 30,
    height: 90,
    colorModel: ImageColorModel.RGBA,
  });
});
