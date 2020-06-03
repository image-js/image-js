/**
 * Apply a gaussian filter to the image.
 * @memberof Image
 * @instance
 * @param {object} options
 * @param {number} [options.radius=1] - Number of pixels around the current pixel.
 * @param {number} [options.sigma] - Sigma parameter for the gaussian.
 * @param {number[]|string[]} [options.channels] - To which channel to apply the filter.
 * @param {string} [options.border='copy']
 * @return {Image}
 */
export default function gaussianFilter(options = {}) {
  let { radius = 1, sigma, channels, border = 'copy' } = options;

  this.checkProcessable('gaussian', {
    bitDepth: [8, 16],
  });

  const kernel = getKernel(radius, sigma);
  return this.convolution([kernel, kernel], {
    border,
    channels,
    algorithm: 'separable',
  });
}

function getKernel(radius, sigma) {
  const n = radius * 2 + 1;
  const kernel = new Array(n);
  const sigmaX = sigma ? sigma : ((n - 1) * 0.5 - 1) * 0.3 + 0.8;
  const scale2X = -0.5 / (sigmaX * sigmaX);
  let sum = 0;
  for (let i = 0; i < n; i++) {
    const x = i - radius;
    const t = Math.exp(scale2X * x * x);
    kernel[i] = t;
    sum += t;
  }

  for (let i = 0; i < n; i++) {
    kernel[i] /= sum;
  }
  return kernel;
}
