import { ImageColorModel, Image } from '../../../Image';
import { compareIntensity } from '../compareIntensity';

test('verify descriptor is correct (descriptorLength = 10)', () => {
  const size = 5;
  const image = new Image(size, size, { colorModel: ImageColorModel.GREY });
  for (let i = 0; i < 2 * size; i++) {
    image.setPixelByIndex(i, [255]);
  }
  const p1 = { column: 0, row: 0 };
  const p2 = { column: -1, row: -2 };
  expect(compareIntensity(image, p1, p2)).toBe(true);
  expect(compareIntensity(image, p2, p1)).toBe(false);
});
