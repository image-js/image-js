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
    offsetX = 0,
    offsetY = 0
  } = options;


  const out = getOutputImageOrInPlace(this, options, { copy: true });
  const maxY = Math.min(out.height, offsetY + toInsert.height);
  const maxX = Math.min(out.width, offsetX + toInsert.width);
  if (out.bitDepth === 1) {
    for (let j = offsetY; j < maxY; j++) {
      for (let i = offsetX; i < maxX; i++) {
        const val = toInsert.getBitXY(i - offsetX, j - offsetY);
        if (val) out.setBitXY(i, j);
        else out.clearBitXY(i, j);
      }
    }
  } else {
    for (let j = offsetY; j < maxY; j++) {
      for (let i = offsetX; i < maxX; i++) {
        out.setPixelXY(i, j, toInsert.getPixelXY(i - offsetX, j - offsetY));
      }
    }
  }


  return out;
}
