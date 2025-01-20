import { Image } from '../../Image.js';

test('multiply by 2', () => {
  let image = testUtils.createRgbaImage([
    [230, 80, 120, 255],
    [100, 140, 13, 1],
  ]);
  image = image.multiply(2);
  const result = testUtils.createRgbaImage([
    [255, 160, 240, 255],
    [200, 255, 26, 2],
  ]);
  expect(image).toStrictEqual(result);
});

test('mulitply by 100', () => {
  let image = testUtils.createRgbaImage([
    [230, 80, 120, 255],
    [100, 140, 13, 1],
  ]);
  image = image.multiply(100);
  const result = testUtils.createRgbaImage([
    [255, 255, 255, 255],
    [255, 255, 255, 100],
  ]);
  expect(image).toStrictEqual(result);
});
test('multiply by decimal', () => {
  let image = testUtils.createRgbaImage([
    [230, 80, 120, 255],
    [100, 140, 13, 1],
  ]);
  image = image.multiply(0.5);
  const result = testUtils.createRgbaImage([
    [115, 40, 60, 127],
    [50, 70, 6, 0],
  ]);
  expect(image).toStrictEqual(result);
});
test('testing channels option', () => {
  let image = testUtils.createRgbaImage([
    [230, 80, 120, 255],
    [100, 140, 13, 1],
  ]);
  image = image.multiply(0.5, { channels: [0, 1] });
  const result = testUtils.createRgbaImage([
    [115, 40, 120, 255],
    [50, 70, 13, 1],
  ]);
  expect(image).toStrictEqual(result);
});
test('testing out option', () => {
  let image = testUtils.createRgbaImage([
    [230, 80, 120, 255],
    [100, 140, 13, 1],
  ]);
  const out = new Image(image.width, image.height, { colorModel: 'RGBA' });
  image = image.multiply(0.5, { channels: [0, 1], out });
  const result = testUtils.createRgbaImage([
    [115, 40, 120, 255],
    [50, 70, 13, 1],
  ]);
  expect(out).toStrictEqual(result);
});
