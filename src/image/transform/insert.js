import { getOutputImageOrInPlace } from '../internal/getOutputImage';
import getImageParameters from '../internal/getImageParameters';

/**
 * @memberof Image
 * @instance
 * @param {Image} toInsert
 * @param {object} [options]
 * @return {Image}
 */
export default function insert(toInsert, options = {}) {
  const parameters = getImageParameters(toInsert);
  this.checkProcessable('insert', parameters);
  let {
    x = 0,
    y = 0
  } = options;


  const out = getOutputImageOrInPlace(this, options, { copy: true });
  const maxY = Math.min(out.height, y + toInsert.height);
  const maxX = Math.min(out.width, x + toInsert.width);
  if (out.bitDepth === 1) {
    for (let j = y; j < maxY; j++) {
      for (let i = x; i < maxX; i++) {
        const val = toInsert.getBitXY(i - x, j - y);
        if (val) out.setBitXY(i, j);
        else out.clearBitXY(i, j);
      }
    }
  } else {
    for (let j = y; j < maxY; j++) {
      for (let i = x; i < maxX; i++) {
        out.setPixelXY(i, j, toInsert.getPixelXY(i - x, j - y));
      }
    }
  }


  return out;
}
