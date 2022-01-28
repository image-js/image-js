import { Mask } from '../..';

describe('clearBorder', () => {
  it('Mask 5x5, without corners', () => {
    let image = testUtils.createMask([
      [0, 0, 1, 0, 0],
      [0, 1, 1, 0, 0],
      [0, 0, 0, 1, 0],
      [0, 1, 0, 0, 0],
      [0, 0, 1, 0, 0],
    ]);

    expect(image.clearBorder()).toMatchMaskData([
      [0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0],
      [0, 0, 0, 1, 0],
      [0, 1, 0, 0, 0],
      [0, 0, 0, 0, 0],
    ]);
  });
  it('Mask 1x1', () => {
    let image = testUtils.createMask([[1]]);

    expect(image.clearBorder()).toMatchMaskData([[0]]);
  });
  it('Same mask, allow corners', () => {
    let image = testUtils.createMask([
      [0, 0, 1, 0, 0],
      [0, 1, 1, 0, 0],
      [0, 0, 0, 1, 0],
      [0, 1, 0, 0, 0],
      [0, 0, 1, 0, 0],
    ]);

    expect(image.clearBorder({ allowCorners: true })).toMatchMaskData([
      [0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0],
    ]);
  });
  it('Mask 5x5, large chunk inside, no corners', () => {
    let image = testUtils.createMask([
      [0, 0, 1, 0, 0],
      [0, 1, 1, 1, 0],
      [0, 1, 1, 1, 0],
      [0, 1, 1, 0, 0],
      [0, 0, 0, 0, 0],
    ]);

    expect(image.clearBorder()).toMatchMaskData([
      [0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0],
    ]);
  });
  it('Mask 3x5, image should not change', () => {
    let image = testUtils.createMask([
      [0, 0, 0, 0, 0],
      [0, 1, 1, 1, 0],
      [0, 0, 0, 0, 0],
    ]);

    expect(image.clearBorder()).toMatchMask(image);
  });
  it('Diagonal of 1, allow corners', () => {
    let image = testUtils.createMask([
      [1, 0, 0, 0, 0],
      [0, 1, 0, 1, 0],
      [0, 0, 1, 0, 0],
      [0, 0, 0, 1, 0],
      [0, 0, 0, 0, 1],
    ]);
    const result = image.clearBorder({ allowCorners: true });
    expect(result).toMatchMaskData([
      [0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0],
    ]);
  });
  it('Out option', () => {
    let image = testUtils.createMask([
      [1, 0, 0, 0, 0],
      [0, 1, 0, 1, 0],
      [0, 0, 0, 0, 0],
      [0, 0, 0, 1, 0],
      [0, 0, 0, 0, 1],
    ]);

    const out = new Mask(5, 5);

    image.clearBorder({ allowCorners: true, out: out });
    expect(out).toMatchMaskData([
      [0, 0, 0, 0, 0],
      [0, 0, 0, 1, 0],
      [0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0],
    ]);
  });
});
