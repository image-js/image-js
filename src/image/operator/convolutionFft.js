/**
 * @memberof Image
 * @instance
 * @param {Array<Array<number>>} kernel
 * @param {object} [options]
 * @param {Array} [options.channels] - Array of channels to treat. Defaults to all channels
 * @param {number} [options.bitDepth=this.bitDepth] - A new bit depth can be specified. This allows to use 32 bits to avoid clamping of floating-point numbers.
 * @param {boolean} [options.normalize=false]
 * @param {number} [options.divisor=1]
 * @param {string} [options.border='copy']
 * @return {Image}
 */
export default function convolutionFft(kernel, options = {}) {
    options = Object.assign({}, options);
    options.algorithm = 'fft';
    return this.convolution(kernel, options);
}
