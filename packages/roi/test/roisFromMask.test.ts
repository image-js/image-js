import { getTestImage } from 'test';
import { ImageKind, threshold, ThresholdAlgorithm } from 'image-js';

import { roisFromMask } from '../src';

test('roisFromMask', () => {
  const image = getTestImage();
  const grey = image.convertColor(ImageKind.GREY);
  const binary = threshold(grey, { algorithm: ThresholdAlgorithm.OTSU });
  const roiObj = roisFromMask(binary);
  const rois = roiObj.getRois();
  expect(rois).toHaveLength(5);
});
