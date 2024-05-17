import { Image } from '../../Image';
import { divide } from '../divide';

test('divide by 2', () => {
  let image = testUtils.createRgbaImage([
    [230, 80, 120, 255],
    [100, 140, 13, 1],
  ]);
  image = divide(image, 2);
  const result = testUtils.createRgbaImage([
    [115, 40, 60, 127],
    [50, 70, 6, 0],
  ]);
  expect(image).toStrictEqual(result);
});

test('error when dividing by 0', () => {
  const image = testUtils.createRgbaImage([
    [230, 80, 120, 255],
    [100, 140, 13, 1],
  ]);
  expect(() => {
    divide(image, 0);
  }).toThrow('Cannot divide by 0');
});
test('divide by decimal', () => {
  let image = testUtils.createRgbaImage([
    [230, 80, 120, 255],
    [100, 140, 13, 4],
  ]);
  image = image.divide(0.25);
  const result = testUtils.createRgbaImage([
    [255, 255, 255, 255],
    [255, 255, 52, 16],
  ]);
  expect(image).toStrictEqual(result);
});
test('divide by prime number', () => {
  let image = testUtils.createRgbaImage([
    [230, 80, 120, 255],
    [100, 140, 13, 1],
  ]);
  image = image.divide(7);
  const result = testUtils.createRgbaImage([
    [32, 11, 17, 36],
    [14, 20, 1, 0],
  ]);
  expect(image).toStrictEqual(result);
});
test('testing channels option', () => {
  let image = testUtils.createRgbaImage([
    [230, 80, 120, 255],
    [100, 140, 13, 1],
  ]);
  image = image.divide(7, { channels: [0, 1, 3] });
  const result = testUtils.createRgbaImage([
    [32, 11, 120, 36],
    [14, 20, 13, 0],
  ]);
  expect(image).toStrictEqual(result);
});
test('testing out option', () => {
  const image = testUtils.createRgbaImage([
    [230, 80, 120, 255],
    [100, 140, 13, 1],
  ]);
  const out = new Image(image.width, image.height, { colorModel: 'RGBA' });
  image.divide(7, { out });
  const result = testUtils.createRgbaImage([
    [32, 11, 17, 36],
    [14, 20, 1, 0],
  ]);
  expect(out).toStrictEqual(result);
});
