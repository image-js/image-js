import { checkKernel } from '../validators/checkKernel';

test('should throw', () => {
  const kernel = [
    [1, 1, 1],
    [1, 0, 1],
  ];

  expect(() => {
    checkKernel(kernel);
  }).toThrow(/the number of rows and columns of the kernel must be odd/);
});
