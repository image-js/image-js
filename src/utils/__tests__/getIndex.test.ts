import { Image } from '../../Image.js';
import { Mask } from '../../Mask.js';
import { getIndex } from '../getIndex.js';

test('mask, index should increment regularly', () => {
  const mask = new Mask(3, 4);

  let index = 0;
  for (let row = 0; row < mask.height; row++) {
    for (let column = 0; column < mask.width; column++) {
      expect(getIndex(column, row, mask)).toBe(index++);
    }
  }
});

test('mask, check specific values', () => {
  const mask = new Mask(3, 4);

  expect(getIndex(1, 1, mask)).toBe(4);
  expect(getIndex(1, 2, mask)).toBe(7);
});

test('image, check specific values', () => {
  const image = new Image(3, 4, { colorModel: 'RGB' });

  expect(getIndex(1, 1, image, 0)).toBe(12);
  expect(getIndex(1, 2, image, 1)).toBe(22);
});
