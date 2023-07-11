import { Image } from '../../../../Image';
import { getSourceWitoutMargins } from '../getSourceWithoutMargins';

test('destination fully in source', () => {
  const source = new Image(10, 10);
  const destination = new Image(5, 5);
  const destinationOrigin = { row: 0, column: 0 };
  const result = getSourceWitoutMargins(source, destination, destinationOrigin);
  expect(result.width).toBe(5);
  expect(result.height).toBe(5);
});

test('destination would exceed source', () => {
  const source = new Image(5, 5);
  const destination = new Image(10, 10);
  const destinationOrigin = { row: 0, column: 0 };
  const result = getSourceWitoutMargins(source, destination, destinationOrigin);
  expect(result.width).toBe(5);
  expect(result.height).toBe(5);
});
