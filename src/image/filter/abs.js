import { getOutputImageOrInPlace } from '../internal/getOutputImage';

/**
 * Calculate the absolute values of an image.
 * Only works on 32-bit images.
 * @memberof Image
 * @instance
 * @param {object} [options]
 * @param {boolean} [options.inPlace=false]
 * @param {Image} [options.out]
 * @return {Image}
 */
export default function abs(options = {}) {
  this.checkProcessable('abs', {
    bitDepth: [32]
  });
  const out = getOutputImageOrInPlace(this, options);
  absolute(this, out);
  return out;
}

function absolute(image, out) {
  for (let i = 0; i < image.data.length; i++) {
    out.data[i] = Math.abs(image.data[i]);
  }
}
