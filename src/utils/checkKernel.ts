/**
 * Checks the that the dimensions of the kernel are odd.
 *
 * @param kernel - Kernel passed to a morphology function.
 * @param functionName - Name of the function.
 */
export function checkKernel(kernel: number[][], functionName: string) {
  if (kernel.length % 2 === 0 || kernel[0].length % 2 === 0) {
    throw new TypeError(
      `${functionName}: The number of rows and columns of the kernel must be odd`,
    );
  }
}
