import { IJS } from '../..';
import {
  getNeighbourIndex,
  indexToRowColumn,
  rowColumnToIndex,
} from '../getNeighbourIndex';

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

test('indexToRowColumn', () => {
  let image = new IJS(3, 5);

  expect(indexToRowColumn(image, 7)).toStrictEqual({ row: 2, column: 1 });
  expect(indexToRowColumn(image, 9)).toStrictEqual({ row: 3, column: 0 });
  expect(indexToRowColumn(image, 3)).toStrictEqual({ row: 1, column: 0 });

  expect(() => {
    indexToRowColumn(image, 20);
  }).toThrow('Index is out of range.');
});
