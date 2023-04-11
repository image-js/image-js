import { Image, ImageColorModel } from '../../Image';
import { getClamp } from '../clamp';

test("clamp 65'536", () => {
  const image = new Image(2, 1, {
    colorModel: ImageColorModel.GREY,
    depth: 16,
  });

  const clamp = getClamp(image);
  expect(clamp(2000000)).toBe(65535);
  expect(clamp(-535)).toBe(0);
});
