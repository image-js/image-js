import { average } from '../average';

describe('average', () => {
  it('5x1 RGB image', () => {
    const image = testUtils.createRgbImage([
      [1, 2, 3],
      [1, 2, 3],
      [1, 2, 3],
      [1, 2, 3],
      [1, 2, 3],
    ]);

    const result = average(image);

    expect(result).toStrictEqual([1, 2, 3]);
  });
  it('5x1 RGBA image', () => {
    const image = testUtils.createRgbaImage([
      [1, 2, 3, 0],
      [1, 2, 3, 0],
      [11, 2, 3, 0],
      [1, 3, 3, 0],
      [1, 6, 3, 0],
    ]);

    const result = image.average();

    expect(result).toStrictEqual([3, 3, 3, 0]);
  });
  it('2x4 GREY image', () => {
    const image = testUtils.createGreyImage([
      [1, 2, 3, 0],
      [1, 2, 3, 0],
    ]);

    const result = image.average();

    expect(result).toStrictEqual([1.5]);
  });
});
