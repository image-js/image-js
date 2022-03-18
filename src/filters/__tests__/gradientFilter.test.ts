import { BorderType } from '../../utils/interpolateBorder';

const kernelX = [
  [1, 0, 0],
  [0, 1, 0],
  [0, 0, 0],
];
const kernelY = [
  [1, 0, 0],
  [0, 0, 0],
  [0, 0, 1],
];
const image = testUtils.createGreyImage([
  [1, 1, 1],
  [1, 1, 1],
  [1, 1, 1],
]);

describe('gradientFilter', () => {
  it('gradientX', () => {
    const result = image.gradientFilter({
      kernelX,
      borderType: BorderType.CONSTANT,
    });

    expect(result).toMatchImageData([
      [1, 1, 1],
      [1, 2, 2],
      [1, 2, 2],
    ]);
  });
  it('gradientY', () => {
    const result = image.gradientFilter({
      kernelY,
      borderType: BorderType.CONSTANT,
    });

    expect(result).toMatchImageData([
      [1, 1, 0],
      [1, 2, 1],
      [0, 1, 1],
    ]);
  });
  it('gradientX and gradientY', () => {
    const result = image.gradientFilter({
      kernelX,
      kernelY,
      borderType: BorderType.CONSTANT,
    });
    expect(result).toMatchImageData([
      [1, 1, 1],
      [1, 2, 2],
      [1, 2, 2],
    ]);
  });
});
