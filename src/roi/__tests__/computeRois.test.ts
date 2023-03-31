import { fromMask } from '..';
import { computeRois } from '../computeRois';

test('3x3 mask', () => {
  const mask = testUtils.createMask([
    [1, 1, 1],
    [1, 0, 0],
    [0, 0, 1],
  ]);
  const roiMapManager = fromMask(mask);
  computeRois(roiMapManager);
  expect(roiMapManager.whiteRois).toHaveLength(2);
  expect(roiMapManager.blackRois).toHaveLength(1);

  expect(roiMapManager.whiteRois).toMatchSnapshot();
  expect(roiMapManager.blackRois).toMatchSnapshot();
});
