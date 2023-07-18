import { Mask } from '../..';

test('5x5 mask, without corners', () => {
  const image = testUtils.createMask([
    [0, 0, 1, 0, 0],
    [0, 1, 1, 0, 0],
    [0, 0, 0, 1, 0],
    [0, 1, 0, 0, 0],
    [0, 0, 1, 0, 0],
  ]);

  expect(image.clearBorder()).toMatchMaskData([
    [0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0],
    [0, 0, 0, 1, 0],
    [0, 1, 0, 0, 0],
    [0, 0, 0, 0, 0],
  ]);
});

test('1x1 mask', () => {
  const image = testUtils.createMask([[1]]);

  expect(image.clearBorder()).toMatchMaskData([[0]]);
});

test('Same mask, allow corners', () => {
  const image = testUtils.createMask([
    [0, 0, 1, 0, 0],
    [0, 1, 1, 0, 0],
    [0, 0, 0, 1, 0],
    [0, 1, 0, 0, 0],
    [0, 0, 1, 0, 0],
  ]);

  expect(image.clearBorder({ allowCorners: true })).toMatchMaskData([
    [0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0],
  ]);
});

test('5x5 mask, large chunk inside, no corners', () => {
  const image = testUtils.createMask([
    [0, 0, 1, 0, 0],
    [0, 1, 1, 1, 0],
    [0, 1, 1, 1, 0],
    [0, 1, 1, 0, 0],
    [0, 0, 0, 0, 0],
  ]);

  expect(image.clearBorder()).toMatchMaskData([
    [0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0],
  ]);
});

test('3x5 mask, image should not change', () => {
  const image = testUtils.createMask([
    [0, 0, 0, 0, 0],
    [0, 1, 1, 1, 0],
    [0, 0, 0, 0, 0],
  ]);

  expect(image.clearBorder()).toMatchMask(image);
});

test('Diagonal of 1, allow corners', () => {
  const image = testUtils.createMask([
    [1, 0, 0, 0, 0],
    [0, 1, 0, 1, 0],
    [0, 0, 1, 0, 0],
    [0, 0, 0, 1, 0],
    [0, 0, 0, 0, 1],
  ]);
  const result = image.clearBorder({ allowCorners: true });
  expect(result).toMatchMaskData([
    [0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0],
  ]);
});

test('Diagonal of 1, color=black', () => {
  let image = testUtils.createMask([
    [1, 0, 0, 0, 0],
    [0, 1, 0, 1, 0],
    [0, 0, 1, 0, 0],
    [0, 0, 0, 1, 0],
    [0, 0, 0, 0, 1],
  ]);
  image = image.invert();
  let result = image.clearBorder({ color: 'black' });
  result = result.invert();
  expect(result).toMatchMaskData([
    [0, 0, 0, 0, 0],
    [0, 1, 0, 1, 0],
    [0, 0, 1, 0, 0],
    [0, 0, 0, 1, 0],
    [0, 0, 0, 0, 0],
  ]);
});

test('5x5 mask, full', () => {
  const image = testUtils.createMask([
    [1, 1, 1, 1, 1],
    [1, 1, 1, 1, 1],
    [1, 1, 1, 1, 1],
    [1, 1, 1, 1, 1],
    [1, 1, 1, 1, 1],
  ]);
  const result = image.clearBorder({ allowCorners: false });
  expect(result).toMatchMaskData([
    [0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0],
  ]);
});

test('out option', () => {
  const image = testUtils.createMask([
    [1, 0, 0, 0, 0],
    [0, 1, 0, 1, 0],
    [0, 0, 0, 0, 0],
    [0, 0, 0, 1, 0],
    [0, 0, 0, 0, 1],
  ]);

  const out = new Mask(5, 5);

  image.clearBorder({ allowCorners: true, out });
  expect(out).toMatchMaskData([
    [0, 0, 0, 0, 0],
    [0, 0, 0, 1, 0],
    [0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0],
  ]);
});

test('5x5 mask, no pixels touching top', () => {
  const image = testUtils.createMask([
    [0, 0, 0, 0, 0],
    [0, 1, 1, 1, 0],
    [0, 0, 0, 0, 0],
    [0, 1, 1, 0, 0],
    [0, 1, 0, 0, 1],
  ]);
  const result = image.clearBorder({ allowCorners: false });
  expect(result).toMatchMaskData([
    [0, 0, 0, 0, 0],
    [0, 1, 1, 1, 0],
    [0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0],
  ]);
});

test('5x5 mask, snake', () => {
  const image = testUtils.createMask([
    [0, 0, 0, 0, 0],
    [0, 1, 1, 1, 0],
    [0, 0, 0, 1, 0],
    [0, 1, 0, 1, 0],
    [0, 0, 0, 1, 1],
  ]);
  const result = image.clearBorder({ allowCorners: false });
  expect(result).toMatchMaskData([
    [0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0],
    [0, 1, 0, 0, 0],
    [0, 0, 0, 0, 0],
  ]);
});

test('larger image', () => {
  const image = testUtils.load('various/grayscale_by_zimmyrose.png');
  const mask = image.threshold();
  const cleared = mask.clearBorder();
  expect(cleared).toMatchImageSnapshot();
});
