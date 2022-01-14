import { MatrixColumnSelectionView } from 'ml-matrix';

import { ColorDepth, IJS, Mask } from '..';
import { borderIterator } from '../utils/borderIterator';
import checkProcessable from '../utils/checkProcessable';
import { imageToOutputMask } from '../utils/getOutputImage';

export interface ClearBorderOptions {
  connectivity?: 4 | 8;
  /**
   * Image to which the inverted image has to be put.
   */
  out?: Mask;
}

export function clearBorder(image: Mask, options?: ClearBorderOptions): Mask;
/**
 * Set the pixels connected to the border of the image to zero. YOu can either use connectivity 4 (share an edge) or 8 (include corners)
 *
 * @param image - The image to process.
 * @param options - Clear border options.
 * @returns The image with cleared borders.
 */
export function clearBorder(
  image: Mask,
  options: ClearBorderOptions = {},
): Mask {
  let { connectivity = 4 } = options;

  if (image instanceof IJS) {
    checkProcessable(image, 'clearBorder', {
      bitDepth: [ColorDepth.UINT1, ColorDepth.UINT8, ColorDepth.UINT16],
      components: 1,
      alpha: false,
    });
  }

  const MAX_ARRAY = 0x00ffff; // 65535 should be enough for most of the cases
  let toProcess = new Uint16Array(MAX_ARRAY + 1);
  const maxValue = image.maxValue;

  let from = 0;
  let to = 0;

  let newImage = image.clone();

  // find relevant border pixels
  for (let pixelIndex of borderIterator(image)) {
    if (newImage.getValueByIndex(pixelIndex, 0) === maxValue) {
      toProcess[to++ % MAX_ARRAY] = pixelIndex;
      newImage.setValueByIndex(pixelIndex, 0, 0);
    }
  }

  // find pixels connected to the border pixels

  while (from <= to) {
    // check neighbours
    let neighbourIndices = [];
    if (connectivity === 8) {
      if (toProcess[from] < image.width) {
      }
    }
  }

  return newImage;
}
