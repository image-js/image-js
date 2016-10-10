/**
 * @memberof Image
 * @instance
 * @param {[[number]]} kernel
 * @param {object} [$1] - options
 * @param {array} [$1.channels] - Array of channels to treat. Defaults to all channels
 * @param {number} [$1.bitDepth=this.bitDepth] - A new bit depth can be specified. This allows to use 32 bits to avoid clamping of floating-point numbers.
 * @param {boolean} [$1.normalize=false]
 * @param {number} [$1.divisor=1]
 * @param {string} [$1.border='copy']
 * @returns {Image}
 */

export default function convolutionFft(kernel, options = {}) {
    options.algorithm = 'fft';
    return this.convolution(kernel, options);
}
