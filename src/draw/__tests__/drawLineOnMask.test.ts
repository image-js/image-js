import { Mask } from '../../Mask';
import { drawLineOnMask } from '../drawLineOnMask';

test('3x3 mask, diagonal', () => {
  const mask = testUtils.createMask([
    [0, 0, 0],
    [0, 0, 0],
    [0, 0, 0],
  ]);

  const from = { row: 0, column: 0 };
  const to = { row: 2, column: 2 };
  const result = mask.drawLine(from, to);

  expect(result).toMatchMaskData([
    [1, 0, 0],
    [0, 1, 0],
    [0, 0, 1],
  ]);
  expect(result).not.toBe(mask);
});

test('5x5 mask', () => {
  const mask = testUtils.createMask([
    [0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0],
  ]);

  const from = { row: 0, column: 0 };
  const to = { row: 5, column: 2 };
  const result = mask.drawLine(from, to);

  expect(result).toMatchMaskData([
    [1, 0, 0, 0, 0],
    [1, 0, 0, 0, 0],
    [0, 1, 0, 0, 0],
    [0, 1, 0, 0, 0],
    [0, 0, 1, 0, 0],
  ]);
  expect(result).not.toBe(mask);
});

test('out parameter set to self', () => {
  const mask = testUtils.createMask([
    [0, 0, 0],
    [0, 0, 0],
    [0, 0, 0],
  ]);

  const from = { row: 0, column: 0 };
  const to = { row: 1, column: 1 };
  const expected = mask.drawLine(from, to, {
    out: mask,
  });

  expect(expected).toMatchMaskData([
    [1, 0, 0],
    [0, 1, 0],
    [0, 0, 0],
  ]);
  expect(expected).toBe(mask);
});

test('out to other image', () => {
  const out = new Mask(2, 3);
  const mask = testUtils.createMask([
    [0, 0],
    [0, 0],
    [1, 0],
  ]);
  const from = { row: 1, column: 0 };
  const to = { row: 2, column: 1 };
  const expected = mask.drawLine(from, to, {
    out,
  });

  expect(expected).toMatchMaskData([
    [0, 0],
    [1, 0],
    [1, 1],
  ]);
  expect(expected).toBe(out);
  expect(expected).not.toBe(mask);
});

test('draw nearly horizontal line', () => {
  const mask = testUtils.createMask([
    [0, 0, 0, 0],
    [0, 0, 0, 0],
    [0, 0, 0, 0],
    [0, 0, 0, 0],
  ]);
  const from = { row: 1, column: 0 };
  const to = { row: 2, column: 3 };
  const expected = mask.drawLine(from, to);
  expect(expected).toMatchMaskData([
    [0, 0, 0, 0],
    [1, 1, 0, 0],
    [0, 0, 1, 1],
    [0, 0, 0, 0],
  ]);
  expect(expected).not.toBe(mask);
});

test('draw horizontal line', () => {
  const mask = testUtils.createMask([
    [0, 0, 0, 0],
    [0, 0, 0, 0],
    [0, 0, 0, 0],
    [0, 0, 0, 0],
  ]);
  const from = { row: 1, column: 0 };
  const to = { row: 1, column: 3 };
  const expected = mask.drawLine(from, to);
  expect(expected).toMatchMaskData([
    [0, 0, 0, 0],
    [1, 1, 1, 1],
    [0, 0, 0, 0],
    [0, 0, 0, 0],
  ]);
  expect(expected).not.toBe(mask);
});

test('draw nearly vertical line', () => {
  const mask = testUtils.createMask([
    [0, 0, 0, 0],
    [0, 0, 0, 0],
    [0, 0, 0, 0],
    [0, 0, 0, 0],
  ]);
  const from = { row: 0, column: 1 };
  const to = { row: 3, column: 2 };
  const expected = mask.drawLine(from, to);
  expect(expected).toMatchMaskData([
    [0, 1, 0, 0],
    [0, 1, 0, 0],
    [0, 0, 1, 0],
    [0, 0, 1, 0],
  ]);
  expect(expected).not.toBe(mask);
});

test('draw vertical line', () => {
  const mask = testUtils.createMask([
    [0, 0, 0, 0],
    [0, 0, 0, 0],
    [0, 0, 0, 0],
    [0, 0, 0, 0],
  ]);
  const from = { row: 0, column: 1 };
  const to = { row: 3, column: 1 };
  const expected = mask.drawLine(from, to);
  expect(expected).toMatchMaskData([
    [0, 1, 0, 0],
    [0, 1, 0, 0],
    [0, 1, 0, 0],
    [0, 1, 0, 0],
  ]);
  expect(expected).not.toBe(mask);
});

test('same from and to', () => {
  const mask = testUtils.createMask([
    [1, 0, 0, 0],
    [1, 0, 0, 0],
    [1, 0, 0, 0],
    [1, 0, 0, 0],
  ]);
  const from = { row: 0, column: 1 };
  const to = { row: 0, column: 1 };
  const result = mask.drawLine(from, to);

  expect(result).toMatchMaskData([
    [1, 1, 0, 0],
    [1, 0, 0, 0],
    [1, 0, 0, 0],
    [1, 0, 0, 0],
  ]);
  expect(result).not.toBe(mask);
});

test('default options', () => {
  const mask = testUtils.createMask([
    [0, 0, 0, 0],
    [0, 0, 0, 0],
    [0, 0, 0, 0],
    [0, 0, 0, 0],
  ]);

  const from = { row: 0, column: 0 };
  const to = { row: mask.height, column: mask.width };
  const result = drawLineOnMask(mask, from, to);

  expect(result).toMatchMaskData([
    [1, 0, 0, 0],
    [0, 1, 0, 0],
    [0, 0, 1, 0],
    [0, 0, 0, 1],
  ]);
});

test('3x3 mask, non-integer coordinates', () => {
  const mask = testUtils.createMask([
    [0, 0, 0],
    [0, 0, 0],
    [0, 0, 0],
  ]);

  const from = { row: 0.5, column: 0.5 };
  const to = { row: 1.5, column: 1.5 };
  const result = mask.drawLine(from, to);
  expect(result).toMatchMaskData([
    [0, 0, 0],
    [0, 1, 0],
    [0, 0, 1],
  ]);
  expect(result).not.toBe(mask);
});

test('3x3 mask, non-integer coordinates, verify symmetry', () => {
  const mask = testUtils.createMask([
    [0, 0, 0],
    [0, 0, 0],
    [0, 0, 0],
  ]);

  const from = { row: 1.5, column: 1.5 };
  const to = { row: 0.5, column: 0.5 };
  const result = mask.drawLine(from, to);
  expect(result).toMatchMaskData([
    [0, 0, 0],
    [0, 1, 0],
    [0, 0, 1],
  ]);
  expect(result).not.toBe(mask);
});

test('5x5 mask, non-integer coordinates', () => {
  const mask = testUtils.createMask([
    [0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0],
  ]);

  const from = { row: 0, column: 0 };
  const to = { row: 4.5, column: 4.5 };
  const result = mask.drawLine(from, to);

  expect(result).toMatchMaskData([
    [1, 0, 0, 0, 0],
    [0, 1, 0, 0, 0],
    [0, 0, 1, 0, 0],
    [0, 0, 0, 1, 0],
    [0, 0, 0, 0, 1],
  ]);
});

test('different origin', () => {
  const image = testUtils.createMask([
    [1, 0, 0, 0],
    [1, 0, 0, 0],
    [1, 0, 0, 0],
    [1, 0, 0, 0],
  ]);
  const from = { row: 0, column: 1 };
  const to = { row: 1, column: 0 };
  const result = image.drawLine(from, to, {
    origin: { column: 1, row: 1 },
  });
  expect(result).toMatchMaskData([
    [1, 0, 0, 0],
    [1, 0, 1, 0],
    [1, 1, 0, 0],
    [1, 0, 0, 0],
  ]);
  expect(result).not.toBe(image);
});

test('different origin, line out of mask', () => {
  const mask = testUtils.createMask([
    [0, 0, 0, 0],
    [0, 0, 0, 0],
    [0, 0, 0, 0],
    [0, 0, 0, 0],
  ]);
  const points = [
    { row: 0, column: 0 },
    { row: 3, column: 3 },
  ];
  let result = mask.drawLine(points[0], points[1], {
    origin: { column: 0, row: 0 },
  });
  expect(result).toMatchMaskData([
    [1, 0, 0, 0],
    [0, 1, 0, 0],
    [0, 0, 1, 0],
    [0, 0, 0, 1],
  ]);

  result = mask.drawLine(points[0], points[1], {
    origin: { column: 3, row: 0 },
  });
  expect(result).toMatchMaskData([
    [0, 0, 0, 1],
    [0, 0, 0, 0],
    [0, 0, 0, 0],
    [0, 0, 0, 0],
  ]);
  expect(result).not.toBe(mask);
});
