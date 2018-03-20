import isInteger from 'is-integer';

export function validateKernel(kernel) {
  let kHeight, kWidth;
  if (Array.isArray(kernel)) {
    if (Array.isArray(kernel[0])) { // 2D array
      if (((kernel.length & 1) === 0) || ((kernel[0].length & 1) === 0)) {
        throw new RangeError('validateKernel: Kernel rows and columns should be odd numbers');
      } else {
        kHeight = Math.floor(kernel.length / 2);
        kWidth = Math.floor(kernel[0].length / 2);
      }
    } else {
      let kernelWidth = Math.sqrt(kernel.length);
      if (isInteger(kernelWidth)) {
        kWidth = kHeight = Math.floor(Math.sqrt(kernel.length) / 2);
      } else {
        throw new RangeError('validateKernel: Kernel array should be a square');
      }
      // we convert the array to a matrix
      let newKernel = new Array(kernelWidth);
      for (let i = 0; i < kernelWidth; i++) {
        newKernel[i] = new Array(kernelWidth);
        for (let j = 0; j < kernelWidth; j++) {
          newKernel[i][j] = kernel[i * kernelWidth + j];
        }
      }
      kernel = newKernel;
    }
  } else {
    throw new Error(`validateKernel: Invalid Kernel: ${kernel}`);
  }
  return { kernel, kWidth, kHeight };
}
