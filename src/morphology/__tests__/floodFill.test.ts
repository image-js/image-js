import { Mask } from '../..';

describe('floodFill', () => {
  it('mask 5x5, default options', () => {
    let image = testUtils.createMask([
      [0, 0, 0, 0, 0],
      [0, 1, 1, 1, 0],
      [0, 1, 0, 1, 0],
      [0, 1, 1, 1, 0],
      [0, 0, 0, 0, 0],
    ]);

    expect(image.floodFill()).toMatchMaskData([
      [0, 0, 0, 0, 0],
      [0, 1, 1, 1, 0],
      [0, 1, 1, 1, 0],
      [0, 1, 1, 1, 0],
      [0, 0, 0, 0, 0],
    ]);
  });
  it('pixels touching border', () => {
    let image = testUtils.createMask([
      [0, 1, 0, 1, 0],
      [0, 1, 1, 1, 0],
      [0, 1, 0, 0, 1],
      [0, 1, 1, 1, 0],
      [0, 0, 0, 0, 0],
    ]);

    expect(image.floodFill()).toMatchMaskData([
      [0, 1, 0, 1, 0],
      [0, 1, 1, 1, 0],
      [0, 1, 1, 1, 1],
      [0, 1, 1, 1, 0],
      [0, 0, 0, 0, 0],
    ]);
  });
  it('mask should not change', () => {
    let image = testUtils.createMask([
      [0, 1, 0, 1, 0],
      [0, 1, 1, 1, 0],
      [0, 1, 0, 0, 0],
      [0, 1, 1, 1, 0],
      [0, 0, 0, 0, 0],
    ]);

    expect(image.floodFill()).toMatchMaskData([
      [0, 1, 0, 1, 0],
      [0, 1, 1, 1, 0],
      [0, 1, 0, 0, 0],
      [0, 1, 1, 1, 0],
      [0, 0, 0, 0, 0],
    ]);
  });
  it('allowCorners true', () => {
    let image = testUtils.createMask([
      [0, 0, 0, 0, 0],
      [1, 1, 1, 1, 0],
      [1, 0, 1, 0, 1],
      [1, 1, 1, 1, 1],
      [0, 0, 0, 0, 0],
    ]);

    expect(image.floodFill({ allowCorners: true })).toMatchMaskData([
      [0, 0, 0, 0, 0],
      [1, 1, 1, 1, 0],
      [1, 1, 1, 0, 1],
      [1, 1, 1, 1, 1],
      [0, 0, 0, 0, 0],
    ]);
  });
  it('1x1 mask', () => {
    let image = testUtils.createMask([[0]]);

    expect(image.floodFill({ allowCorners: true })).toMatchMaskData([[0]]);
  });
  it('Out option', () => {
    let image = testUtils.createMask([
      [0, 0, 0, 0, 0],
      [0, 1, 1, 1, 0],
      [0, 1, 0, 1, 0],
      [0, 0, 1, 1, 0],
      [0, 0, 0, 0, 0],
    ]);

    const out = new Mask(5, 5);

    image.floodFill({ out });
    expect(out).toMatchMaskData([
      [0, 0, 0, 0, 0],
      [0, 1, 1, 1, 0],
      [0, 1, 1, 1, 0],
      [0, 0, 1, 1, 0],
      [0, 0, 0, 0, 0],
    ]);
  });
  it('in place modification', () => {
    let image = testUtils.createMask([
      [0, 0, 0, 0, 0],
      [0, 1, 1, 1, 0],
      [0, 1, 0, 1, 0],
      [0, 0, 1, 1, 0],
      [0, 0, 1, 0, 0],
    ]);

    image.floodFill({ out: image });
    expect(image).toMatchMaskData([
      [0, 0, 0, 0, 0],
      [0, 1, 1, 1, 0],
      [0, 1, 1, 1, 0],
      [0, 0, 1, 1, 0],
      [0, 0, 1, 0, 0],
    ]);
  });
});
