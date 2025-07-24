import { describe, expect, it } from 'vitest';

import { fromMask } from '../fromMask.js';

describe('ROI surface', () => {
  it('surface of a figure with a hole', () => {
    const mask = testUtils.createMask([
      [0, 1, 1, 1],
      [0, 1, 0, 1],
      [0, 1, 1, 1],
      [0, 0, 0, 0],
    ]);

    const rois = fromMask(mask).getRois();

    expect(rois[0].surface).toBe(8);
  });

  it('surface of a slightly more complex figure', () => {
    const mask = testUtils.createMask([
      [0, 1, 1, 1, 0],
      [1, 0, 0, 1, 0],
      [1, 1, 1, 1, 0],
      [0, 1, 0, 1, 0],
      [0, 1, 1, 0, 0],
    ]);

    const rois = fromMask(mask).getRois();

    expect(rois[0].surface).toBe(13);
  });

  it('surface on multiple ROIs', () => {
    const mask = testUtils.createMask([
      [0, 1, 1, 1, 0],
      [1, 0, 0, 0, 0],
      [0, 1, 1, 1, 0],
      [0, 1, 0, 1, 0],
      [0, 1, 1, 1, 0],
    ]);

    const rois = fromMask(mask).getRois();

    expect(rois[0].surface).toBe(1);
    expect(rois[1].surface).toBe(3);
    expect(rois[2].surface).toBe(8);
  });
});
