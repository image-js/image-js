import { Mask } from '../../Mask';
import { copyTo } from '../copyTo';

test('default options', () => {
  let source = testUtils.createGreyImage([[100, 0]]);
  let target = testUtils.createGreyImage([[50, 255]]);
  const result = copyTo(source, target);
  expect(result).toMatchImageData([[100, 0]]);
});

test('GREYA images: transparent source, opaque target', () => {
  let source = testUtils.createGreyaImage([[100, 0]]);
  let target = testUtils.createGreyaImage([[50, 255]]);
  const result = source.copyTo(target);
  expect(result).toMatchImageData([[50, 255]]);
});

test('GREYA images: opaque source, transparent target', () => {
  let source = testUtils.createGreyaImage([[100, 255]]);
  let target = testUtils.createGreyaImage([[50, 0]]);
  const result = source.copyTo(target);
  expect(result).toMatchImageData([[100, 255]]);
});

test('GREYA image: alpha different from 255', () => {
  let source = testUtils.createGreyaImage([[100, 128]]);
  let target = testUtils.createGreyaImage([[50, 64]]);
  const result = source.copyTo(target);
  const alpha = 128 + 64 * (1 - 128 / 255);
  const component = (100 * 128 + 50 * 64 * (1 - 128 / 255)) / alpha;
  expect(result).toMatchImageData([[component, alpha]]);
});

test('Bigger GREYA image', () => {
  let target = testUtils.createGreyaImage([[100, 0, 200, 0, 150, 0]]);
  let source = testUtils.createGreyaImage([[20, 255]]);
  const result = source.copyTo(target);
  expect(result).toMatchImageData([[20, 255, 200, 0, 150, 0]]);
});

test('Bigger GREYA image with offset outside target', () => {
  let target = testUtils.createGreyaImage([[100, 0, 200, 0, 150, 0]]);
  let source = testUtils.createGreyaImage([[20, 255]]);
  const result = source.copyTo(target, { origin: { row: -1, column: 0 } });
  expect(result).toMatchImageData([[100, 0, 200, 0, 150, 0]]);
});

test('GREY image', () => {
  let source = testUtils.createGreyImage([[100, 150, 200, 250]]);
  let target = testUtils.createGreyImage([[20, 50]]);

  const result = source.copyTo(target);
  expect(result).toMatchImageData([[100, 150]]);
});

test('GREY image with offset', () => {
  let target = testUtils.createGreyImage([
    [100, 150],
    [200, 250],
  ]);
  let source = testUtils.createGreyImage([[20]]);
  const result = source.copyTo(target, { origin: { row: 1, column: 1 } });
  expect(result).toMatchImageData([
    [100, 150],
    [200, 20],
  ]);
});

test('Copy GREY image to itself', () => {
  let target = testUtils.createGreyImage([
    [100, 150],
    [200, 250],
  ]);
  const result = target.copyTo(target, { origin: { row: 1, column: 1 } });
  expect(result).toMatchImageData([
    [100, 150],
    [200, 100],
  ]);
});

test('source image larger than target (should crop)', () => {
  let source = testUtils.createGreyImage([
    [100, 150],
    [200, 250],
  ]);
  let target = testUtils.createGreyImage([[20]]);
  const result = source.copyTo(target);
  expect(result).toMatchImageData([[100]]);
});

test('negative offset', () => {
  let source = testUtils.createGreyImage([
    [100, 150],
    [200, 250],
    [100, 100],
  ]);
  let target = testUtils.createGreyImage([[20]]);
  const result = source.copyTo(target, { origin: { row: -1, column: -1 } });
  expect(result).toMatchImageData([[250]]);
});

test('RGBA images', () => {
  let target = testUtils.createRgbaImage([
    [1, 2, 3, 255],
    [4, 5, 6, 255],
    [7, 8, 9, 0],
  ]);
  let source = testUtils.createRgbaImage([[3, 3, 3, 255]]);
  const result = source.copyTo(target, { origin: { row: 1, column: 0 } });
  expect(result).toMatchImageData([
    [1, 2, 3, 255],
    [3, 3, 3, 255],
    [7, 8, 9, 0],
  ]);
});

test('testing out option', () => {
  let source = testUtils.createGreyaImage([[100, 255]]);
  let target = testUtils.createGreyaImage([[50, 0]]);
  const copy = source.copyTo(target);
  const result = source.copyTo(target, { out: target });
  expect(target).toBe(result);
  expect(copy).toMatchImage(target);
});

test('mask, no offsets', () => {
  let target = new Mask(4, 3);

  let source = testUtils.createMask([
    [1, 1],
    [1, 1],
  ]);
  const result = source.copyTo(target);
  expect(result).toMatchImageData([
    [1, 1, 0, 0],
    [1, 1, 0, 0],
    [0, 0, 0, 0],
  ]);
});

test('mask, positive offsets', () => {
  let target = new Mask(4, 3);

  let source = testUtils.createMask([
    [1, 1],
    [1, 1],
  ]);
  const result = source.copyTo(target, { origin: { row: 0, column: 1 } });
  expect(result).toMatchImageData([
    [0, 1, 1, 0],
    [0, 1, 1, 0],
    [0, 0, 0, 0],
  ]);
});

test('mask, offsets out of target', () => {
  let target = new Mask(4, 3);

  let source = testUtils.createMask([
    [1, 1],
    [1, 1],
  ]);
  const result = source.copyTo(target, { origin: { row: 2, column: 3 } });

  expect(result).toMatchImageData([
    [0, 0, 0, 0],
    [0, 0, 0, 0],
    [0, 0, 0, 1],
  ]);
});

test('mask, negative offsets', () => {
  let target = new Mask(4, 3);

  let source = testUtils.createMask([
    [1, 1],
    [1, 1],
  ]);
  const result = source.copyTo(target, { origin: { row: -1, column: 0 } });
  expect(result).toMatchImageData([
    [1, 1, 0, 0],
    [0, 0, 0, 0],
    [0, 0, 0, 0],
  ]);
});

test('mask, target with some values', () => {
  let target = testUtils.createMask([
    [0, 0, 0, 1],
    [0, 0, 1, 1],
    [0, 0, 0, 1],
  ]);

  let source = testUtils.createMask([
    [1, 1],
    [1, 1],
  ]);
  const result = source.copyTo(target, { origin: { row: 0, column: 1 } });
  expect(result).toMatchImageData([
    [0, 1, 1, 1],
    [0, 1, 1, 1],
    [0, 0, 0, 1],
  ]);
});

test('incompatible image types', () => {
  let source = testUtils.createGreyImage([[100, 255]]);
  let target = testUtils.createGreyaImage([[50, 0]]);

  expect(() => source.copyTo(target)).toThrow(
    /copyTo: source and target must have the same color model./,
  );
});
