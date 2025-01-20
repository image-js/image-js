import { Image } from '../../Image.js';
import { hue } from '../greyAlgorithms.js';

test('hue is zero', () => {
  const image = new Image(1, 1, { colorModel: 'RGBA' });

  expect(hue(20, 20, 20, image)).toBe(0);
});

test('max value red', () => {
  const image = new Image(1, 1, { colorModel: 'RGBA' });

  expect(hue(255, 0, 0, image)).toBe(0);
});

test('max value green', () => {
  const image = new Image(1, 1, { colorModel: 'RGBA' });

  expect(hue(0, 255, 0, image)).toBe(85);
});

test('max value blue', () => {
  const image = new Image(1, 1, { colorModel: 'RGBA' });

  expect(hue(0, 0, 255, image)).toBe(170);
});
