import { checkKernel } from '../checkKernel';

test('should throw', () => {
  const kernel = [
    [1, 1, 1],
    [1, 0, 1],
  ];

  expect(() => {
    checkKernel(kernel, 'blabla');
  }).toThrow(
    /blabla: The number of rows and columns of the kernel must be odd/,
  );
});
