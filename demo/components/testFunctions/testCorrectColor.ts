import { IJS } from '../../../src';
import {
  getMeasuredColors,
  getReferenceColors,
} from '../../../src/correctColor/__tests__/testUtil/formatData';
import { polishAltered } from '../../../src/correctColor/__tests__/testUtil/imageColors';
import { referenceColorCard } from '../../../src/correctColor/__tests__/testUtil/referenceColorCard';
import { correctColor } from '../../../src/correctColor/correctColor';

/**
 * Copy a black and a red square to the source image.
 *
 * @param image - Input image.
 * @returns The treated image.
 */
export function testCorrectColor(image: IJS): IJS {
  const measuredColors = getMeasuredColors(polishAltered);
  const referenceColors = getReferenceColors(referenceColorCard);
  console.log('correct color');
  const result = correctColor(image, measuredColors, referenceColors);
  console.log(result.getPixel(0, 0));

  return result;
}
