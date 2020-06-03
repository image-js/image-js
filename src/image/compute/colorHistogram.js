import newArray from 'new-array';

/**
 * @memberof Image
 * @instance
 * @param {object} [options]
 * @param {boolean} [options.useAlpha=true]
 * @param {number} [options.nbSlots=512]
 * @return {number[]}
 */
export default function getColorHistogram(options = {}) {
  let { useAlpha = true, nbSlots = 512 } = options;

  this.checkProcessable('getColorHistogram', {
    bitDepth: [8, 16],
    components: [3],
  });

  let nbSlotsCheck = Math.log(nbSlots) / Math.log(8);
  if (nbSlotsCheck !== Math.floor(nbSlotsCheck)) {
    throw new RangeError(
      'nbSlots must be a power of 8. Usually 8, 64, 512 or 4096',
    );
  }

  let bitShift = this.bitDepth - nbSlotsCheck;

  let data = this.data;
  let result = newArray(Math.pow(8, nbSlotsCheck), 0);
  let factor2 = Math.pow(2, nbSlotsCheck * 2);
  let factor1 = Math.pow(2, nbSlotsCheck);

  for (let i = 0; i < data.length; i += this.channels) {
    let slot =
      (data[i] >> bitShift) * factor2 +
      (data[i + 1] >> bitShift) * factor1 +
      (data[i + 2] >> bitShift);
    if (useAlpha && this.alpha) {
      result[slot] += data[i + this.channels - 1] / this.maxValue;
    } else {
      result[slot]++;
    }
  }

  return result;
}
