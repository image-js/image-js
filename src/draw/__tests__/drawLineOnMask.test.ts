import { Mask } from '../../Mask';
import { drawLineOnMask } from '../drawLineOnMask';

describe('drawLine on Mask', () => {
  it('3x3 mask, diagonal', () => {
    const mask = testUtils.createMask([
      [0, 0, 0],
      [0, 0, 0],
      [0, 0, 0],
    ]);

    const from = { row: 0, column: 0 };
    const to = { row: 2, column: 2 };
    const result = mask.drawLine(from, to);

    expect(result).toMatchMaskData([
      [1, 0, 0],
      [0, 1, 0],
      [0, 0, 1],
    ]);
    expect(result).not.toBe(mask);
  });
  it('5x5 mask', () => {
    const mask = testUtils.createMask([
      [0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0],
    ]);

    const from = { row: 0, column: 0 };
    const to = { row: 5, column: 2 };
    const result = mask.drawLine(from, to);

    expect(result).toMatchMaskData([
      [1, 0, 0, 0, 0],
      [1, 0, 0, 0, 0],
      [0, 1, 0, 0, 0],
      [0, 1, 0, 0, 0],
      [0, 0, 1, 0, 0],
    ]);
    expect(result).not.toBe(mask);
  });
  it('out parameter set to self', () => {
    const mask = testUtils.createMask([
      [0, 0, 0],
      [0, 0, 0],
      [0, 0, 0],
    ]);

    const from = { row: 0, column: 0 };
    const to = { row: 1, column: 1 };
    const expected = mask.drawLine(from, to, {
      out: mask,
    });

    expect(expected).toMatchMaskData([
      [1, 0, 0],
      [0, 1, 0],
      [0, 0, 0],
    ]);
    expect(expected).toBe(mask);
  });
  it('out to other image', () => {
    const out = new Mask(2, 3);
    const mask = testUtils.createMask([
      [0, 0],
      [0, 0],
      [1, 0],
    ]);
    const from = { row: 1, column: 0 };
    const to = { row: 2, column: 1 };
    const expected = mask.drawLine(from, to, {
      out,
    });

    expect(expected).toMatchMaskData([
      [0, 0],
      [1, 0],
      [1, 1],
    ]);
    expect(expected).toBe(out);
    expect(expected).not.toBe(mask);
  });
  it('draw nearly horizontal line', () => {
    const image = testUtils.createMask([
      [0, 0, 0, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
    ]);
    const from = { row: 1, column: 0 };
    const to = { row: 2, column: 3 };
    const expected = image.drawLine(from, to);
    expect(expected).toMatchMaskData([
      [0, 0, 0, 0],
      [1, 1, 0, 0],
      [0, 0, 1, 1],
      [0, 0, 0, 0],
    ]);
    expect(expected).not.toBe(image);
  });

  it('draw horizontal line', () => {
    const image = testUtils.createMask([
      [0, 0, 0, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
    ]);
    const from = { row: 1, column: 0 };
    const to = { row: 1, column: 3 };
    const expected = image.drawLine(from, to);
    expect(expected).toMatchMaskData([
      [0, 0, 0, 0],
      [1, 1, 1, 1],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
    ]);
    expect(expected).not.toBe(image);
  });
  it('draw nearly vertical line', () => {
    const image = testUtils.createMask([
      [0, 0, 0, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
    ]);
    const from = { row: 0, column: 1 };
    const to = { row: 3, column: 2 };
    const expected = image.drawLine(from, to);
    expect(expected).toMatchMaskData([
      [0, 1, 0, 0],
      [0, 1, 0, 0],
      [0, 0, 1, 0],
      [0, 0, 1, 0],
    ]);
    expect(expected).not.toBe(image);
  });
  it('draw vertical line', () => {
    const image = testUtils.createMask([
      [0, 0, 0, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
    ]);
    const from = { row: 0, column: 1 };
    const to = { row: 3, column: 1 };
    const expected = image.drawLine(from, to);
    expect(expected).toMatchMaskData([
      [0, 1, 0, 0],
      [0, 1, 0, 0],
      [0, 1, 0, 0],
      [0, 1, 0, 0],
    ]);
    expect(expected).not.toBe(image);
  });
  it('same from and to', () => {
    const mask = testUtils.createMask([
      [1, 0, 0, 0],
      [1, 0, 0, 0],
      [1, 0, 0, 0],
      [1, 0, 0, 0],
    ]);
    const from = { row: 0, column: 1 };
    const to = { row: 0, column: 1 };
    const result = mask.drawLine(from, to);

    expect(result).toMatchMask(mask);
  });
  it('default options', () => {
    const mask = testUtils.createMask([
      [0, 0, 0, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
    ]);

    const from = { row: 0, column: 0 };
    const to = { row: mask.height, column: mask.width };
    const result = drawLineOnMask(mask, from, to);

    expect(result).toMatchMaskData([
      [1, 0, 0, 0],
      [0, 1, 0, 0],
      [0, 0, 1, 0],
      [0, 0, 0, 1],
    ]);
  });
});
