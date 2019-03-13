import { load } from 'test/common';

test('positive id', async () => {
  const img = await load('BW7x7.png');
  const roiManager = img.getRoiManager();
  const mask = img.mask(0.5);
  roiManager.fromMask(mask);
  const roi = roiManager.getRoi(2);

  expect(roi.id).toBe(2);
  expect(roi.minX).toBe(3);
  expect(roi.minY).toBe(3);
});

test('negative id', async () => {
  const img = await load('BW7x7.png');
  const roiManager = img.getRoiManager();
  const mask = img.mask(0.5);
  roiManager.fromMask(mask);
  const roi = roiManager.getRoi(-2);

  expect(roi.id).toBe(-2);
  expect(roi.minX).toBe(2);
  expect(roi.maxX).toBe(4);
});

test('inexistant id', async () => {
  const img = await load('BW7x7.png');
  const roiManager = img.getRoiManager();
  const mask = img.mask(0.5);
  roiManager.fromMask(mask);
  expect(() => roiManager.getRoi(0)).toThrow(/found no Roi with id 0/);
  expect(() => roiManager.getRoi(5)).toThrow(/found no Roi with id 5/);
  expect(() => roiManager.getRoi(-5)).toThrow(/found no Roi with id -5/);
});
