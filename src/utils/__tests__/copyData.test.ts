import { expect, test } from 'vitest';

import { Image } from '../../Image.js';
import { copyData } from '../copyData.js';

test('2x3 GREY image', () => {
  const source = testUtils.createGreyImage([
    [1, 2, 3],
    [4, 5, 6],
  ]);
  const target = new Image(3, 2, { colorModel: 'GREY' });
  copyData(source, target);

  expect(target).toMatchImageData([
    [1, 2, 3],
    [4, 5, 6],
  ]);
});

test('check error', () => {
  const source = testUtils.createGreyImage([
    [1, 2, 3],
    [4, 5, 6],
  ]);
  const target = new Image(5, 2, { colorModel: 'GREY' });

  expect(() => {
    copyData(source, target);
  }).toThrow('images width, height or color model is different');
});
