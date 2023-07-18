import { setBlendedPixel } from '../setBlendedPixel';

test('GREYA image, default options', () => {
  const image = testUtils.createGreyaImage([
    [50, 255],
    [20, 30],
  ]);
  setBlendedPixel(image, 0, 1);
  expect(image).toMatchImageData([
    [50, 255],
    [0, 255],
  ]);
});

test('GREYA images: transparent source, opaque target', () => {
  const image = testUtils.createGreyaImage([[50, 255]]);
  setBlendedPixel(image, 0, 0, { color: [100, 0] });
  expect(image).toMatchImageData([[50, 255]]);
});

test('GREYA images: opaque source, transparent target', () => {
  const image = testUtils.createGreyaImage([[50, 0]]);
  setBlendedPixel(image, 0, 0, { color: [100, 255] });
  expect(image).toMatchImageData([[100, 255]]);
});

test('GREYA image: alpha different from 255', () => {
  const image = testUtils.createGreyaImage([[50, 64]]);
  setBlendedPixel(image, 0, 0, { color: [100, 128] });
  const alpha = 128 + 64 * (1 - 128 / 255);
  const component = (100 * 128 + 50 * 64 * (1 - 128 / 255)) / alpha;
  expect(image).toMatchImageData([[component, alpha]]);
});

test('asymetrical test', () => {
  const image = testUtils.createGreyaImage([
    [50, 255, 1, 2, 3, 4],
    [20, 30, 5, 6, 7, 8],
    [1, 2, 3, 4, 5, 6],
  ]);
  setBlendedPixel(image, 2, 0, { color: [0, 125] });
  expect(image).toMatchImageData([
    [50, 255, 1, 2, 0, 127],
    [20, 30, 5, 6, 7, 8],
    [1, 2, 3, 4, 5, 6],
  ]);
});

test('2x2 mask, default options', () => {
  const mask = testUtils.createMask([
    [1, 0],
    [0, 0],
  ]);
  setBlendedPixel(mask, 1, 0);
  expect(mask).toMatchMask(mask);
});

test('2x2 mask, color is 1', () => {
  const mask = testUtils.createMask([
    [1, 0],
    [0, 0],
  ]);
  setBlendedPixel(mask, 1, 0, { color: [1] });

  expect(mask).toMatchMaskData([
    [1, 1],
    [0, 0],
  ]);
});
