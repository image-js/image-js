import { fromMask, Image } from '../../../src';

/**
 * Draw the Feret diameters of the largest ROI detected in the image.
 *
 * @param image - Input image.
 * @returns The image with the Feret diameters.
 */
export function testGetFeret(image: Image): Image {
  const grey = image.convertColor('GREY');
  const mask = grey.threshold({ threshold: 35 / 255 });
  const roiMapManager = fromMask(mask);

  const rois = roiMapManager.getRois({ kind: 'black' });

  const roi = rois.sort((a, b) => b.surface - a.surface)[0];
  if (roi) {
    const roiMask = roi.getMask();
    const feret = roiMask.getFeret();

    let result = image.paintMask(roiMask, {
      origin: roi.origin,
      color: [0, 0, 255, 255],
    });

    // draw minimum diameter in green
    result = result.drawLine(
      feret.minDiameter.points[0],
      feret.minDiameter.points[1],
      {
        strokeColor: [0, 255, 0, 255],
        origin: roi.origin,
      },
    );
    // draw maximum diameter in red
    result = result.drawLine(
      feret.maxDiameter.points[0],
      feret.maxDiameter.points[1],
      {
        strokeColor: [255, 0, 0, 255],
        origin: roi.origin,
      },
    );
    return result;
  } else {
    return image;
  }
}
