import { RoiMapManager } from '../RoiMapManager';
import { fromMask } from '../fromMask';

test('should work with crop', () => {
  const image = testUtils.createGreyImage([
    [1, 2, 0, 0, 0],
    [5, 0, 0, 200, 0],
    [0, 0, 225, 250, 200],
    [0, 0, 0, 0, 0],
  ]);

  const mask = image.threshold({ threshold: 100 / 255 });

  expect(mask).toMatchMaskData([
    [0, 0, 0, 0, 0],
    [0, 0, 0, 1, 0],
    [0, 0, 1, 1, 1],
    [0, 0, 0, 0, 0],
  ]);
  const roiMapManager = fromMask(mask);
  const rois = roiMapManager.getRois();

  const result = image.crop(rois[0]);

  expect(result).toMatchImageData([
    [0, 200, 0],
    [225, 250, 200],
  ]);

  const roiMapManager2 = RoiMapManager.fromMask(mask);
  const rois2 = roiMapManager2.getRois();

  const result2 = image.crop(rois2[0]);

  expect(result2).toMatchImageData([
    [0, 200, 0],
    [225, 250, 200],
  ]);
});
