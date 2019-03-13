import { load } from 'test/common';

test('merge two rois', async () => {
  const img = await load('BW7x7.png');
  const roiManager = img.getRoiManager();
  const mask = img.mask(0.5);
  roiManager.fromMask(mask);

  const roi1 = roiManager.getRoi(1);
  expect(roi1.surface).toBe(16);

  const roi2 = roiManager.getRoi(2);
  expect(roi2.surface).toBe(1);

  roiManager.mergeRois([1, 2]);

  const roi = roiManager.getRoi(1);
  expect(roi.surface).toBe(17);

  // Second roi shouldn't exist anymore
  expect(() => roiManager.getRoi(2)).toThrow(/found no Roi with id 2/);
});

test('merge three rois', async () => {
  const img = await load('BW7x7.png');
  const roiManager = img.getRoiManager();
  const mask = img.mask(0.5);
  roiManager.fromMask(mask);

  roiManager.mergeRois([-2, 1, 2]);

  const roi = roiManager.getRoi(-2);
  expect(roi.surface).toBe(25);
});

test('errors', async () => {
  const img = await load('BW7x7.png');
  const roiManager = img.getRoiManager();
  const mask = img.mask(0.5);
  roiManager.fromMask(mask);

  expect(() => roiManager.mergeRois(1)).toThrow(
    /Roi ids must be an array of integers/
  );
  expect(() => roiManager.mergeRois([1.4])).toThrow(
    /Roi ids must be an array of integers/
  );
  expect(() => roiManager.mergeRois([1])).toThrow(
    /Roi ids must have at least two elements/
  );
  expect(() => roiManager.mergeRois([1, 1])).toThrow(
    /Roi ids must be all different/
  );
  expect(() => roiManager.mergeRois([1, 5])).toThrow(/found no Roi with id 5/);
});
