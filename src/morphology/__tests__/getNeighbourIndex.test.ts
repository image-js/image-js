import { IJS } from '../..';
import { getNeighbourIndex, rowColumnToIndex } from '../getNeighbourIndex';

describe('getNeighbourIndex', () => {
  it('values in range', () => {
    let image = new IJS(4, 3);

    expect(getNeighbourIndex(image, 1, 1, 1)).toBe(6);
  });
  it('pixels out of image', () => {
    let image = new IJS(4, 3);

    expect(getNeighbourIndex(image, 0, -1, -1)).toBeNaN();
    expect(getNeighbourIndex(image, 4, -1, 0)).toBeNaN();
    expect(getNeighbourIndex(image, 0, -1, -1)).toBeNaN();
  });
});

test('rowColumnToIndex', () => {
  let image = new IJS(4, 3);

  expect(rowColumnToIndex(image, 1, 1)).toBe(5);
  expect(rowColumnToIndex(image, 2, 3)).toBe(11);
  expect(rowColumnToIndex(image, 0, 2)).toBe(2);

  expect(() => {
    rowColumnToIndex(image, 5, 0);
  }).toThrow('Pixel row and/or column are out of range.');
});
