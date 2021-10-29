import { read } from '..';
import { IJS } from '../../IJS';
import { ImageColorModel } from '../../utils/colorModels';

test('read existing image', async () => {
  const img = await read(testUtils.getPath('formats/rgba32.png'));
  expect(img).toBeInstanceOf(IJS);
  expect(img).toMatchObject({
    width: 30,
    height: 90,
    colorModel: ImageColorModel.RGBA,
  });
});
