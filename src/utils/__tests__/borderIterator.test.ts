import { IJS, Mask } from '../..';
import { borderIterator } from '../borderIterator';

describe('borderIterator', () => {
  it('3x4 image', () => {
    let image = new IJS(4, 3);
    expect(getBorderPixels(image)).toStrictEqual([
      0, 1, 2, 3, 7, 11, 10, 9, 8, 4,
    ]);
  });
  it('5x4 image', () => {
    let image = new IJS(3, 5);
    expect(getBorderPixels(image)).toStrictEqual([
      0, 1, 2, 5, 8, 11, 14, 13, 12, 9, 6, 3,
    ]);
  });
});

function getBorderPixels(image: IJS | Mask): number[] {
  let result = [];
  for (let i of borderIterator(image)) {
    result.push(i);
  }
  return result;
}
