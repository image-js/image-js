import { DerivativeFilters } from '..';
import { BorderType } from '../../utils/interpolateBorder';

const image = testUtils.createGreyImage([
  [1, 1, 1],
  [1, 1, 1],
  [1, 1, 1],
]);

describe('derivativeFilter', () => {
  it('Sobel', () => {
    const result = image.derivativeFilter({
      borderType: BorderType.CONSTANT,
    });

    expect(result).toMatchImageData([
      [4, 4, 4],
      [4, 0, 4],
      [4, 4, 4],
    ]);
  });
  it('Scharr', () => {
    const result = image.derivativeFilter({
      filter: DerivativeFilters.SCHARR,
      borderType: BorderType.CONSTANT,
    });

    expect(result).toMatchImageData([
      [18, 16, 18],
      [16, 0, 16],
      [18, 16, 18],
    ]);
  });
  it('Prewitt', () => {
    const result = image.derivativeFilter({
      filter: DerivativeFilters.PREWITT,
      borderType: BorderType.CONSTANT,
    });

    expect(result).toMatchImageData([
      [2, 3, 2],
      [3, 0, 3],
      [2, 3, 2],
    ]);
  });
});
