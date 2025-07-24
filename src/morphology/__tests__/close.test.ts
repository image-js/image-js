import { expect, test } from 'vitest';

test('check for GREY image 5x5', () => {
  const kernel = [
    [1, 1, 1],
    [1, 1, 1],
    [1, 1, 1],
  ];
  const image = testUtils.createGreyImage([
    [255, 255, 0, 255, 255],
    [255, 0, 0, 0, 255],
    [255, 0, 0, 0, 255],
    [255, 0, 0, 0, 255],
    [255, 255, 0, 255, 255],
  ]);

  expect(image.close({ kernel })).toMatchImageData([
    [255, 255, 255, 255, 255],
    [255, 0, 0, 0, 255],
    [255, 0, 0, 0, 255],
    [255, 0, 0, 0, 255],
    [255, 255, 255, 255, 255],
  ]);
});

test('check for GREY image 5x5 2 iterations', () => {
  const kernel = [
    [1, 1, 1],
    [1, 1, 1],
    [1, 1, 1],
  ];
  const image = testUtils.createGreyImage([
    [255, 255, 0, 255, 255],
    [255, 0, 0, 0, 255],
    [255, 0, 0, 0, 255],
    [255, 0, 0, 0, 255],
    [255, 255, 0, 255, 255],
  ]);

  expect(image.close({ kernel, iterations: 2 })).toMatchImageData([
    [255, 255, 255, 255, 255],
    [255, 0, 0, 0, 255],
    [255, 0, 0, 0, 255],
    [255, 0, 0, 0, 255],
    [255, 255, 255, 255, 255],
  ]);
});

test('check on 5x5 mask', () => {
  const mask = testUtils.createMask(`
      1 1 0 1 1
      1 0 0 0 1
      1 0 0 0 1
      1 0 0 0 1
      1 1 0 1 1
    `);

  expect(mask.close()).toMatchMaskData(`
        1 1 1 1 1
        1 0 0 0 1
        1 0 0 0 1
        1 0 0 0 1
        1 1 1 1 1
    `);
});
