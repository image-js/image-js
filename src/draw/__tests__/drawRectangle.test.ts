import { Image } from '../../Image';
import { drawRectangle } from '../drawRectangle';

test('RGB image', () => {
  const image = testUtils.createRgbImage([
    [100, 150, 200, 100, 150, 0],
    [100, 200, 5, 3, 200, 0],
    [150, 200, 255, 6, 150, 0],
  ]);

  const result = image.drawRectangle({
    width: image.width,
    height: image.height,
    strokeColor: [255, 0, 0],
  });

  expect(result).toMatchImageData([
    [255, 0, 0, 255, 0, 0],
    [255, 0, 0, 255, 0, 0],
    [255, 0, 0, 255, 0, 0],
  ]);
  expect(result).not.toBe(image);
});

test('out parameter set to self', () => {
  const image = testUtils.createRgbImage([
    [100, 100, 200, 100, 100, 100, 150, 200, 255],
    [100, 100, 5, 3, 100, 100, 150, 200, 255],
    [100, 100, 255, 6, 150, 5, 5, 3, 200],
  ]);

  const result = image.drawRectangle({
    width: image.width,
    height: image.height,
    strokeColor: [255, 0, 0],
    fillColor: [0, 5, 2],
    out: image,
  });
  expect(result).toMatchImageData([
    [255, 0, 0, 255, 0, 0, 255, 0, 0],
    [255, 0, 0, 0, 5, 2, 255, 0, 0],
    [255, 0, 0, 255, 0, 0, 255, 0, 0],
  ]);
  expect(result).toBe(image);
});

test('out to other image', () => {
  const out = new Image(2, 3);
  const image = testUtils.createRgbImage([
    [100, 150, 200, 100, 150, 0],
    [100, 200, 5, 3, 200, 0],
    [150, 200, 255, 6, 150, 0],
  ]);
  const result = image.drawRectangle({
    width: image.width,
    height: image.height,
    strokeColor: [255, 0, 0],
    fillColor: [1, 1, 1],
    out,
  });
  expect(result).toMatchImageData([
    [255, 0, 0, 255, 0, 0],
    [255, 0, 0, 255, 0, 0],
    [255, 0, 0, 255, 0, 0],
  ]);
  expect(result).toBe(out);
  expect(result).not.toBe(image);
});

test('draw rectangle in grey image', () => {
  const image = testUtils.createGreyImage([
    [1, 1, 1, 1, 1, 1],
    [1, 1, 1, 1, 1, 1],
    [1, 1, 1, 1, 1, 1],
    [1, 1, 1, 1, 1, 1],
    [1, 1, 1, 1, 1, 1],
    [1, 1, 1, 1, 1, 1],
  ]);
  const result = image.drawRectangle({
    width: image.width,
    height: image.height,
    strokeColor: [2],
  });
  expect(result).toMatchImageData([
    [2, 2, 2, 2, 2, 2],
    [2, 1, 1, 1, 1, 2],
    [2, 1, 1, 1, 1, 2],
    [2, 1, 1, 1, 1, 2],
    [2, 1, 1, 1, 1, 2],
    [2, 2, 2, 2, 2, 2],
  ]);
  expect(result).not.toBe(image);
});

test('draw filled rectangle in grey image', () => {
  const image = testUtils.createGreyImage([
    [1, 1, 1, 1, 1, 1],
    [1, 1, 1, 1, 1, 1],
    [1, 1, 1, 1, 1, 1],
    [1, 1, 1, 1, 1, 1],
    [1, 1, 1, 1, 1, 1],
    [1, 1, 1, 1, 1, 1],
  ]);
  const result = image.drawRectangle({
    width: image.width,
    height: image.height,
    strokeColor: [2],
    fillColor: [3],
  });
  expect(result).toMatchImageData([
    [2, 2, 2, 2, 2, 2],
    [2, 3, 3, 3, 3, 2],
    [2, 3, 3, 3, 3, 2],
    [2, 3, 3, 3, 3, 2],
    [2, 3, 3, 3, 3, 2],
    [2, 2, 2, 2, 2, 2],
  ]);
  expect(result).not.toBe(image);
});

test('draw filled rectangle with no stroke', () => {
  const image = testUtils.createGreyImage([
    [1, 1, 1, 1, 1, 1],
    [1, 1, 1, 1, 1, 1],
    [1, 1, 1, 1, 1, 1],
    [1, 1, 1, 1, 1, 1],
    [1, 1, 1, 1, 1, 1],
    [1, 1, 1, 1, 1, 1],
  ]);
  const result = image.drawRectangle({
    width: image.width,
    height: image.height,
    strokeColor: 'none',
    fillColor: [3],
  });
  expect(result).toMatchImageData([
    [1, 1, 1, 1, 1, 1],
    [1, 3, 3, 3, 3, 1],
    [1, 3, 3, 3, 3, 1],
    [1, 3, 3, 3, 3, 1],
    [1, 3, 3, 3, 3, 1],
    [1, 1, 1, 1, 1, 1],
  ]);
  expect(result).not.toBe(image);
});

test('draw rectangle with no options', () => {
  const image = testUtils.createGreyImage([
    [1, 1, 1, 1, 1, 1],
    [1, 1, 1, 1, 1, 1],
    [1, 1, 1, 1, 1, 1],
    [1, 1, 1, 1, 1, 1],
    [1, 1, 1, 1, 1, 1],
    [1, 1, 1, 1, 1, 1],
  ]);
  const result = image.drawRectangle({
    width: image.width,
    height: image.height,
  });
  expect(result).toMatchImageData([
    [0, 0, 0, 0, 0, 0],
    [0, 1, 1, 1, 1, 0],
    [0, 1, 1, 1, 1, 0],
    [0, 1, 1, 1, 1, 0],
    [0, 1, 1, 1, 1, 0],
    [0, 0, 0, 0, 0, 0],
  ]);
  expect(result).not.toBe(image);
});

test('fillColor = none', () => {
  const image = testUtils.createGreyImage([
    [1, 1, 1, 1, 1, 1],
    [1, 1, 1, 1, 1, 1],
    [1, 1, 1, 1, 1, 1],
    [1, 1, 1, 1, 1, 1],
    [1, 1, 1, 1, 1, 1],
    [1, 1, 1, 1, 1, 1],
  ]);
  const result = image.drawRectangle({
    width: image.width,
    height: image.height,
    fillColor: 'none',
  });
  expect(result).toMatchImageData([
    [0, 0, 0, 0, 0, 0],
    [0, 1, 1, 1, 1, 0],
    [0, 1, 1, 1, 1, 0],
    [0, 1, 1, 1, 1, 0],
    [0, 1, 1, 1, 1, 0],
    [0, 0, 0, 0, 0, 0],
  ]);
  expect(result).not.toBe(image);
});

test('outside of image', () => {
  const image = testUtils.createGreyImage([
    [1, 1, 1, 1, 1, 1],
    [1, 1, 1, 1, 1, 1],
    [1, 1, 1, 1, 1, 1],
    [1, 1, 1, 1, 1, 1],
    [1, 1, 1, 1, 1, 1],
    [1, 1, 1, 1, 1, 1],
  ]);
  const result = image.drawRectangle({
    width: image.width,
    height: image.height,
    strokeColor: [2],
    fillColor: [3],
    origin: { column: 1, row: 1 },
  });
  expect(result).toMatchImageData([
    [1, 1, 1, 1, 1, 1],
    [1, 2, 2, 2, 2, 2],
    [1, 2, 3, 3, 3, 3],
    [1, 2, 3, 3, 3, 3],
    [1, 2, 3, 3, 3, 3],
    [1, 2, 3, 3, 3, 3],
  ]);
  expect(result).not.toBe(image);
});

test('mask, not filled', () => {
  const mask = testUtils.createMask([
    [0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0],
  ]);
  const result = mask.drawRectangle({
    width: 4,
    height: 4,
    strokeColor: [1],
    origin: { column: 1, row: 1 },
  });

  expect(result).toMatchMaskData([
    [0, 0, 0, 0, 0, 0],
    [0, 1, 1, 1, 1, 0],
    [0, 1, 0, 0, 1, 0],
    [0, 1, 0, 0, 1, 0],
    [0, 1, 1, 1, 1, 0],
    [0, 0, 0, 0, 0, 0],
  ]);
  expect(result).not.toBe(mask);
});

test('mask, filled', () => {
  const mask = testUtils.createMask([
    [0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0],
  ]);
  const result = mask.drawRectangle({
    width: 4,
    height: 4,
    fillColor: [1],
    strokeColor: [1],
    origin: { column: 1, row: 1 },
  });

  expect(result).toMatchMaskData([
    [0, 0, 0, 0, 0, 0],
    [0, 1, 1, 1, 1, 0],
    [0, 1, 1, 1, 1, 0],
    [0, 1, 1, 1, 1, 0],
    [0, 1, 1, 1, 1, 0],
    [0, 0, 0, 0, 0, 0],
  ]);
});

test('mask, no options', () => {
  const mask = testUtils.createMask([
    [0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0],
  ]);
  const result = mask.drawRectangle();

  expect(result).toMatchMaskData([
    [1, 1, 1, 1, 1, 1],
    [1, 1, 1, 1, 1, 1],
  ]);
  expect(result).not.toBe(mask);
});

test('mask, call directly, no options', () => {
  const mask = testUtils.createMask([
    [0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0],
  ]);
  const result = drawRectangle(mask);

  expect(result).toMatchMaskData([
    [1, 1, 1, 1, 1, 1],
    [1, 1, 1, 1, 1, 1],
  ]);
});

test('points out of mask', () => {
  const mask = testUtils.createMask([
    [0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0],
  ]);
  const result = mask.drawRectangle({
    width: 4,
    height: 4,
    fillColor: [2],
    strokeColor: [1],
    origin: { column: 3, row: 3 },
  });
  expect(result).toMatchMaskData([
    [0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0],
    [0, 0, 0, 1, 1, 1],
    [0, 0, 0, 1, 2, 2],
    [0, 0, 0, 1, 2, 2],
  ]);
});
