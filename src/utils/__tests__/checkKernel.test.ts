import { expect, test } from 'vitest';

import { checkKernel } from '../validators/checkKernel.js';

test('should throw', () => {
  const kernel = [
    [1, 1, 1],
    [1, 0, 1],
  ];

  expect(() => {
    checkKernel(kernel);
  }).toThrowError(/the number of rows and columns of the kernel must be odd/);
});
