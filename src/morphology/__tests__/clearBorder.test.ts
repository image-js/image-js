import { Mask } from '../..';

test('5x5 mask, without corners', () => {
  let image = testUtils.createMask([
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
  let image = testUtils.createMask([[1]]);

  expect(image.clearBorder()).toMatchMaskData([[0]]);
});

test('Same mask, allow corners', () => {
  let image = testUtils.createMask([
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
  let image = testUtils.createMask([
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
  let image = testUtils.createMask([
    [0, 0, 0, 0, 0],
    [0, 1, 1, 1, 0],
    [0, 0, 0, 0, 0],
  ]);

  expect(image.clearBorder()).toMatchMask(image);
});

test('Diagonal of 1, allow corners', () => {
  let image = testUtils.createMask([
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
  let image = testUtils.createMask([
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
  let image = testUtils.createMask([
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
  let image = testUtils.createMask([
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
  let image = testUtils.createMask([
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
