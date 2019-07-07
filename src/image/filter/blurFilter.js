/**
 * Blurs the image by averaging the neighboring pixels.
 * @memberof Image
 * @instance
 * @param {object} [options]
 * @param {number} [options.radius=1] - Number of pixels around the current pixel to average
 * @return {Image}
 */
export default function blurFilter(options = {}) {
  const { radius = 1 } = options;

  if (radius < 1) {
    throw new Error('radius must be greater than 1');
  }

  const n = 2 * radius + 1;
  const kernel = new Array(n);
  for (let i = 0; i < n; i++) {
    kernel[i] = new Array(n);
    for (let j = 0; j < n; j++) {
      kernel[i][j] = 1 / (n * n);
    }
  }

  return this.convolution(kernel);
}
