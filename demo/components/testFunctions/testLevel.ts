import { IJS } from '../../../src';

/**
 * Enhance contrast of the source image using level.
 *
 * @param image - Input image.
 * @returns The treated image.
 */
export function testLevel(image: IJS): IJS {
  return image.level({
    inputMin: 50,
    inputMax: 200,
    outputMin: 255,
    outputMax: 0,
  });
}
