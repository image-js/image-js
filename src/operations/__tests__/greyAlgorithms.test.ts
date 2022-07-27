import { IJS, ImageColorModel } from '../../IJS';
import { hue } from '../greyAlgorithms';

test('hue is zero', () => {
  const image = new IJS(1, 1, { colorModel: ImageColorModel.RGBA });

  expect(hue(20, 20, 20, image)).toBe(0);
});

test('max value red', () => {
  const image = new IJS(1, 1, { colorModel: ImageColorModel.RGBA });

  expect(hue(255, 0, 0, image)).toBe(0);
});

test('max value green', () => {
  const image = new IJS(1, 1, { colorModel: ImageColorModel.RGBA });

  expect(hue(0, 255, 0, image)).toBe(85);
});

test('max value blue', () => {
  const image = new IJS(1, 1, { colorModel: ImageColorModel.RGBA });

  expect(hue(0, 0, 255, image)).toBe(170);
});
