import { toBeDeepCloseTo } from 'jest-matcher-deep-close-to';

import { load } from 'test/common';
expect.extend({ toBeDeepCloseTo });
test('positive id', async () => {
  const img = await load('BW7x7.png');
  const roiManager = img.getRoiManager();
  const mask = img.mask(0.5);
  roiManager.fromMask(mask);
  const roi = roiManager.getRoi(2);

  expect(roi.id).toBe(2);
  expect(roi.minX).toBe(3);
  expect(roi.minY).toBe(3);

  expect(roi.toJSON()).toBeDeepCloseTo({
    id: 2,
    minX: 3,
    maxX: 3,
    minY: 3,
    maxY: 3,
    meanX: 3,
    meanY: 3,
    height: 1,
    width: 1,
    surface: 1,
    filledSurface: 1,
    hullSurface: 1,
    hullPerimeter: 4,
    mbrWidth: 1,
    mbrHeight: 1,
    mbrSurface: 1,
    eqpc: 1.1283,
    ped: 1.08677,
    feretDiameterMin: 1,
    feretDiameterMax: 1.41421,
    aspectRatio: 0.7071,
    fillRatio: 1,
    sphericity: 1.0382794,
    roundness: 0.6366197,
    solidity: 1,
    perimeter: 3.4142135,
  });
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
