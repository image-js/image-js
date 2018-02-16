import Image from '../../Image';
import { factorDimensions } from '../../../util/converter';
import { validInterpolations, checkInterpolation } from '../../internal/checks';

import nearestNeighbor from './nearestNeighbor';

/**
 * Resize an image
 * @memberof Image
 * @instance
 * @param {object} [options]
 * @param {number} [options.width=this.width] - new width
 * @param {number} [options.height=this.height] - new height
 * @param {number} [options.factor=1] - scaling factor (applied to the new width and height values)
 * @param {InterpolationAlgorithm} [options.interpolation='nearestNeighbor']
 * @param {boolean} [options.preserveAspectRatio=true] - preserve width/height ratio if only one of them is defined
 * @return {Image}
 */
export default function resize(options = {}) {
  const {
    factor = 1,
    interpolation = validInterpolations.nearestneighbor,
    preserveAspectRatio = true
  } = options;

  const interpolationToUse = checkInterpolation(interpolation);

  let width = options.width;
  let height = options.height;

  if (!width) {
    if (height && preserveAspectRatio) {
      width = Math.round(height * (this.width / this.height));
    } else {
      width = this.width;
    }
  }
  if (!height) {
    if (preserveAspectRatio) {
      height = Math.round(width * (this.height / this.width));
    } else {
      height = this.height;
    }
  }

  ({ width, height } = factorDimensions(factor, width, height));

  if (width === this.width && height === this.height) {
    const newImage = this.clone();
    newImage.position = [0, 0];
    return newImage;
  }

  let shiftX = Math.round((this.width - width) / 2);
  let shiftY = Math.round((this.height - height) / 2);
  const newImage = Image.createFrom(this, { width, height, position: [shiftX, shiftY] });

  switch (interpolationToUse) {
    case validInterpolations.nearestneighbor:
      nearestNeighbor.call(this, newImage, width, height);
      break;
    default:
      throw new Error(`unsupported resize interpolation: ${interpolationToUse}`);
  }

  return newImage;
}
