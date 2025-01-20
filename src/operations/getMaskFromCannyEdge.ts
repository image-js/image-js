import type { Image } from '../Image.js';
import type { DilateOptions } from '../morphology/index.js';
import { fromMask } from '../roi/index.js';

/**
 * Creates a mask with ROI shapes with CannyEdge filter. Then these shapes
 * get "filled" through internalIds.
 * @param image - Image to get the mask with.
 * @param options - GetMaskFromCannyEdge options.
 * @returns Mask
 */
export function getMaskFromCannyEdge(image: Image, options?: DilateOptions) {
  const kernel = options?.kernel ?? [
    [1, 1, 1],
    [1, 1, 1],
    [1, 1, 1],
  ];
  const iterations = options?.iterations ?? 1;

  let mask = image.cannyEdgeDetector();
  mask = mask.dilate({ iterations, kernel });

  const roiMap = fromMask(mask);
  const rois = roiMap.getRois({ kind: 'white' });
  for (const roi of rois) {
    const ids = new Set(
      roi.internalIDs.filter((value) => {
        return value < 0;
      }),
    );
    for (let i = roi.origin.row; i < roi.origin.row + roi.height; i++) {
      for (let j = roi.origin.column; j < roi.origin.column + roi.width; j++) {
        const value = roi.getMapValue(j, i);
        if (ids.has(value)) {
          mask.setBit(j, i, 1);
        }
      }
    }
  }
  return mask;
}
