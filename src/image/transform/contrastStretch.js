import Image from '../Image';
import { GREY } from '../model/model';

/**
 * Apply contrast stretching to the current image.
 * @memberof Image
 * @instance
 * @param {number} alpha - The alpha parameter for contrast stretching.
 * @param {number} beta - The beta parameter for contrast stretching.
 * @return {Image} - New image with contrast stretched.
 * @example
 * var stretchedImage = image.contrastStretch(1.2, 10);
 */
export default function contrastStretch(alpha, beta) {
  this.checkProcessable('contrastStretch', {
    bitDepth: [8],
    colorModel: [GREY],
  });

  let newImage = Image.createFrom(this);

  const [min, max] = this.minMax();

  this.forEachPixel((x, y, value) => {
    const stretchedValue = ((value - min) / (max - min)) * 255;
    const adjustedValue = alpha * stretchedValue + beta;

    const finalValue = Math.max(0, Math.min(255, adjustedValue));

    newImage.setValueXY(x, y, finalValue);
  });

  return newImage;
}
