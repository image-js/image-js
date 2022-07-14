import { Mask } from '../..';

describe('floodFill', () => {
  it('mask 5x5, default options', () => {
    let image = testUtils.createMask([
      [0, 0, 1, 0, 0],
      [0, 0, 1, 0, 0],
      [0, 1, 0, 0, 0],
      [1, 0, 0, 1, 0],
      [0, 0, 0, 0, 0],
    ]);

    expect(image.floodFill()).toMatchMaskData([
      [1, 1, 1, 0, 0],
      [1, 1, 1, 0, 0],
      [1, 1, 0, 0, 0],
      [1, 0, 0, 1, 0],
      [0, 0, 0, 0, 0],
    ]);
  });
  it('5x5 mask, other start point', () => {
    let image = testUtils.createMask([
      [0, 0, 0, 0, 0],
      [1, 1, 1, 1, 1],
      [0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0],
    ]);

    expect(image.floodFill({ origin: { row: 0, column: 3 } })).toMatchMaskData([
      [1, 1, 1, 1, 1],
      [1, 1, 1, 1, 1],
      [0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0],
    ]);
  });
  it('mask should not change', () => {
    let image = testUtils.createMask([
      [1, 1, 0, 1, 0],
      [0, 1, 1, 1, 0],
      [0, 1, 0, 0, 0],
      [0, 1, 1, 1, 0],
      [0, 0, 0, 0, 0],
    ]);

    expect(image.floodFill()).toMatchMaskData([
      [1, 1, 0, 1, 0],
      [0, 1, 1, 1, 0],
      [0, 1, 0, 0, 0],
      [0, 1, 1, 1, 0],
      [0, 0, 0, 0, 0],
    ]);
  });
  it('allowCorners true', () => {
    let image = testUtils.createMask([
      [0, 1, 0, 0, 0],
      [1, 0, 1, 1, 0],
      [1, 1, 1, 1, 1],
      [0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0],
    ]);

    expect(
      image.floodFill({ origin: { row: 1, column: 1 }, allowCorners: true }),
    ).toMatchMaskData([
      [1, 1, 1, 1, 1],
      [1, 1, 1, 1, 1],
      [1, 1, 1, 1, 1],
      [0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0],
    ]);
  });
  it('1x1 mask', () => {
    let image = testUtils.createMask([[0]]);

    expect(image.floodFill({ allowCorners: true })).toMatchMaskData([[1]]);
  });
  it('out option', () => {
    let image = testUtils.createMask([
      [0, 0, 0, 0, 0],
      [0, 1, 1, 1, 0],
      [0, 1, 0, 1, 0],
      [0, 0, 1, 1, 0],
      [0, 0, 0, 0, 0],
    ]);

    const out = new Mask(5, 5);

    image.floodFill({ origin: { row: 2, column: 2 }, out });

    expect(out).toMatchMaskData([
      [0, 0, 0, 0, 0],
      [0, 1, 1, 1, 0],
      [0, 1, 1, 1, 0],
      [0, 0, 1, 1, 0],
      [0, 0, 0, 0, 0],
    ]);
  });
  it('larger image', () => {
    const image = testUtils.load('morphology/alphabetCannyEdge.png');
    const mask = image.threshold();
    const flooded = mask.floodFill();
    expect(flooded).toMatchIJSSnapshot();
  });
});
