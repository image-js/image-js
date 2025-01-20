import { polishAltered } from '../../../src/correctColor/__tests__/testUtils/imageColors.js';
import { referenceColorCard } from '../../../src/correctColor/__tests__/testUtils/referenceColorCard.js';
import { correctColor } from '../../../src/correctColor/correctColor.js';
import {
  getMeasuredColors,
  getReferenceColors,
} from '../../../src/correctColor/utils/formatData.js';
import type { Image } from '../../../src/index.js';

/**
 * Copy a black and a red square to the source image.
 * @param image - Input image.
 * @returns The treated image.
 */
export function testCorrectColor(image: Image): Image {
  const measuredColors = getMeasuredColors(polishAltered);
  const referenceColors = getReferenceColors(referenceColorCard);
  console.log('correct color');
  const result = correctColor(image, measuredColors, referenceColors);
  console.log(result.getPixel(0, 0));

  return result;
}
