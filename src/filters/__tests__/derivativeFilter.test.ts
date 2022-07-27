import { DerivativeFilters } from '..';
import { BorderType } from '../../utils/interpolateBorder';

const image = testUtils.createGreyImage([
  [1, 1, 1],
  [1, 1, 1],
  [1, 1, 1],
]);

test('Sobel', () => {
  const result = image.derivativeFilter({
    borderType: BorderType.CONSTANT,
  });

  expect(result).toMatchImageData([
    [4, 4, 4],
    [4, 0, 4],
    [4, 4, 4],
  ]);
});

test('Scharr', () => {
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

test('Prewitt', () => {
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
