import { Mask } from '../..';
import { getIndex } from '../getIndex';

describe('getIndex', () => {
  it('index should increment regularly', () => {
    let mask = new Mask(3, 4);

    let index = 0;
    for (let row = 0; row < mask.height; row++) {
      for (let column = 0; column < mask.width; column++) {
        expect(getIndex(row, column, 0, mask)).toBe(index++);
      }
    }
  });
  it('check specific values', () => {
    let mask = new Mask(3, 4);

    expect(getIndex(1, 1, 0, mask)).toBe(4);
    expect(getIndex(2, 1, 0, mask)).toBe(7);
  });
});
