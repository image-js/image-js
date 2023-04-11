import { decodeJpeg } from '..';
import { ImageColorModel } from '../../utils/constants/colorModels';

const tests = [['grey6'], ['grey12'], ['rgb6'], ['rgb12']] as const;

test.each(tests)('should load from buffer %s', async (name) => {
  const buffer = testUtils.loadBuffer(`formats/${name}.jpg`);
  const img = decodeJpeg(buffer);
  expect(img.colorModel).toBe(ImageColorModel.RGBA);
  expect(img.depth).toBe(8);
});
