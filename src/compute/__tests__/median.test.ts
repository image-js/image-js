import { median } from '../median';

describe('median', () => {
  it('5x1 RGB image', () => {
    const image = testUtils.createRgbImage([
      [1, 2, 3],
      [1, 2, 3],
      [1, 2, 3],
      [1, 2, 3],
      [1, 2, 3],
    ]);

    const result = median(image);

    expect(result).toStrictEqual([1, 2, 3]);
  });
  it('5x1 RGBA image', () => {
    const image = testUtils.createRgbaImage([
      [1, 2, 3, 1],
      [1, 2, 3, 1],
      [11, 2, 3, 2],
      [1, 3, 3, 3],
      [1, 6, 3, 3],
    ]);

    const result = image.median();

    expect(result).toStrictEqual([1, 2, 3, 2]);
  });
  it('2x4 GREY image', () => {
    const image = testUtils.createGreyImage([
      [1, 2, 2, 2],
      [1, 2, 3, 2],
    ]);

    const result = image.median();

    expect(result).toStrictEqual([2]);
  });
});
