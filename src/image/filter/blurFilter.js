import convolutionFft from '../operator/convolutionFft';

/**
 * Apply a filter to blur the image
 * @memberof Image
 * @instance
 * @param {object} options
 * @param {number} [options.radius=1] : number of pixels around the current pixel to average
 * @return {Image}
 */
// first release of mean filter
export default function blurFilter(options = {}) {
  let { radius = 1 } = options;
  this.checkProcessable('meanFilter', {
    components: [1],
    bitDepth: [8, 16]
  });

  if (radius < 1) {
    throw new Error('Number of neighbors should be grater than 0');
  }

  let n = 2 * radius + 1;
  let size = n * n;
  let kernel = new Array(size);

  for (let i = 0; i < kernel.length; i++) {
    kernel[i] = 1;
  }

  return convolutionFft.call(this, kernel);
}
