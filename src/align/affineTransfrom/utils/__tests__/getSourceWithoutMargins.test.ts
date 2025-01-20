import { Image } from '../../../../Image.js';
import { getSourceWithoutMargins } from '../getSourceWithoutMargins.js';

test('destination fully in source', () => {
  const source = new Image(10, 10);
  const destination = new Image(5, 5);
  const destinationOrigin = { row: 0, column: 0 };
  const result = getSourceWithoutMargins(
    source,
    destination,
    destinationOrigin,
  );
  expect(result.width).toBe(5);
  expect(result.height).toBe(5);
});

test('destination would exceed source', () => {
  const source = new Image(5, 5);
  const destination = new Image(10, 10);
  const destinationOrigin = { row: 0, column: 0 };
  const result = getSourceWithoutMargins(
    source,
    destination,
    destinationOrigin,
  );
  expect(result.width).toBe(5);
  expect(result.height).toBe(5);
});

test('origin different than 0,0', () => {
  const source = testUtils.createGreyImage([
    [1, 2, 3, 4],
    [5, 6, 7, 8],
    [9, 10, 11, 12],
    [13, 14, 15, 16],
  ]);
  const destination = new Image(2, 2);
  const destinationOrigin = { row: 1, column: 1 };
  const result = getSourceWithoutMargins(
    source,
    destination,
    destinationOrigin,
  );
  expect(result).toMatchImageData([
    [6, 7],
    [10, 11],
  ]);
});

test('origin different than 0,0 and on border', () => {
  const source = testUtils.createGreyImage([
    [1, 2, 3, 4],
    [5, 6, 7, 8],
    [9, 10, 11, 12],
    [13, 14, 15, 16],
  ]);
  const destination = new Image(2, 2);
  const destinationOrigin = { row: 3, column: 3 };
  const result = getSourceWithoutMargins(
    source,
    destination,
    destinationOrigin,
  );
  expect(result).toMatchImageData([[16]]);
});
