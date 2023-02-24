import { ImageColorModel, Image } from '../../../Image';
import { getPatchIntensityCentroid } from '../getPatchIntensityCentroid';

test('3x3 empty image', () => {
  const image = new Image(7, 7, { colorModel: ImageColorModel.GREY });
  const result = getPatchIntensityCentroid(image);
  expect(result).toStrictEqual([{ column: 0, row: 0 }]);
});
