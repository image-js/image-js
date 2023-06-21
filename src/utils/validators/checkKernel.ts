/**
 * Checks the that the dimensions of the kernel are odd.
 * @param kernel - Kernel passed to a morphology function.
 */
export function checkKernel(kernel: number[][]) {
  if (kernel.length % 2 === 0 || kernel[0].length % 2 === 0) {
    throw new TypeError(
      'the number of rows and columns of the kernel must be odd',
    );
  }
}
