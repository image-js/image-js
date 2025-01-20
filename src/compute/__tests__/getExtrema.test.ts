import { getExtrema } from '../getExtrema.js';

test('minimum of grey image from legacy code', () => {
  const image = testUtils.createGreyImage([
    [5, 5, 5, 5, 5, 5, 5, 5, 5, 5],
    [5, 5, 5, 5, 5, 5, 5, 5, 5, 5],
    [5, 5, 5, 2, 5, 5, 5, 5, 5, 5],
    [5, 5, 5, 5, 5, 5, 5, 5, 5, 5],
    [5, 5, 5, 5, 5, 5, 5, 5, 5, 5],
    [5, 5, 5, 5, 5, 5, 5, 5, 5, 5],
    [5, 5, 5, 5, 5, 5, 5, 5, 5, 5],
    [5, 5, 5, 5, 5, 5, 2, 5, 5, 5],
    [5, 5, 5, 5, 5, 5, 5, 5, 5, 5],
    [5, 5, 5, 5, 5, 5, 5, 5, 5, 5],
  ]);

  const result = getExtrema(image, { kind: 'minimum' });
  expect(result).toStrictEqual([
    { column: 3, row: 2 },
    { column: 6, row: 7 },
  ]);
});

test('maximum of grey image from legacy code', () => {
  const image = testUtils.createGreyImage([
    [1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
    [1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
    [1, 1, 4, 4, 4, 1, 1, 1, 1, 1],
    [1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
    [1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
    [1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
    [1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
    [1, 1, 1, 1, 1, 1, 2, 1, 1, 1],
    [1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
    [1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
  ]);

  const result = getExtrema(image, { kind: 'maximum' });

  expect(result).toStrictEqual([
    { column: 2, row: 2 },
    { column: 3, row: 2 },
    { column: 4, row: 2 },
    { column: 6, row: 7 },
  ]);
});

test('maximum with cross algorithm', () => {
  const image = testUtils.createGreyImage([
    [0, 0, 0],
    [0, 1, 0],
    [0, 0, 0],
  ]);

  const result = getExtrema(image, { kind: 'maximum', algorithm: 'cross' });

  expect(result).toStrictEqual([{ column: 1, row: 1 }]);
});

test('maximum with square algorithm', () => {
  const image = testUtils.createGreyImage([
    [0, 0, 0, 1, 1],
    [0, 1, 0, 0, 0],
    [0, 0, 0, 0, 0],
    [2, 3, 4, 0, 0],
    [0, 0, 0, 0, 0],
  ]);

  const result = getExtrema(image, { kind: 'maximum', algorithm: 'square' });
  expect(result).toStrictEqual([
    { column: 1, row: 1 },
    { column: 2, row: 3 },
  ]);
});

test('maximum with square algorithm with a mask option', () => {
  const image = testUtils.createGreyImage([
    [0, 0, 0, 1, 1],
    [0, 4, 0, 0, 0],
    [0, 0, 0, 0, 0],
    [2, 3, 4, 0, 0],
    [0, 0, 0, 0, 0],
  ]);
  const mask = testUtils.createMask([
    [0, 0, 0, 1, 1],
    [0, 1, 0, 0, 0],
    [0, 0, 0, 0, 0],
    [1, 1, 1, 0, 0],
    [0, 0, 0, 0, 0],
  ]);
  const result = getExtrema(image, {
    mask,
    kind: 'maximum',
    algorithm: 'square',
  });
  expect(result).toStrictEqual([
    { column: 1, row: 1 },
    { column: 2, row: 3 },
  ]);
});

test('testing for error handling', () => {
  const image = testUtils.createGreyImage([
    [0, 0, 0, 1, 1],
    [0, 1, 0, 0, 0],
    [0, 0, 0, 0, 0],
    [2, 3, 4, 0, 0],
    [0, 0, 0, 0, 0],
  ]);
  //@ts-expect-error error testing
  expect(() => getExtrema(image, { algorithm: 'blah' })).toThrow(
    /unreachable: blah/,
  );
});
