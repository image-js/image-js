import { IJS, Mask } from '../..';
import { ImageColorModel } from '../colorModels';
import { getIndex } from '../getIndex';

describe('getIndex', () => {
  it('mask, index should increment regularly', () => {
    let mask = new Mask(3, 4);

    let index = 0;
    for (let row = 0; row < mask.height; row++) {
      for (let column = 0; column < mask.width; column++) {
        expect(getIndex(column, row, mask)).toBe(index++);
      }
    }
  });
  it('mask, check specific values', () => {
    let mask = new Mask(3, 4);

    expect(getIndex(1, 1, mask)).toBe(4);
    expect(getIndex(1, 2, mask)).toBe(7);
  });
  it('image, check specific values', () => {
    let image = new IJS(3, 4, { colorModel: ImageColorModel.RGB });

    expect(getIndex(1, 1, image, 0)).toBe(12);
    expect(getIndex(1, 2, image, 1)).toBe(22);
  });
});
