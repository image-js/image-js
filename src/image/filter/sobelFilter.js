import gradientFilter from './gradientFilter';
import { SOBEL_X, SOBEL_Y } from '../../util/kernels';

/**
 * @memberof Image
 * @instance
 * @param {object} [options]
 * @param {string} [options.border='copy']
 * @param {*} [options.channels]
 * @param {number} [options.bitDepth=this.bitDepth] Specify the bitDepth of the resulting image
 * @return {Image}
 */
export default function sobelFilter(options) {
  return gradientFilter.call(this, Object.assign({}, options, {
    kernelX: SOBEL_X,
    kernelY: SOBEL_Y
  }));
}
