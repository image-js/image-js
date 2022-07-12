import { IJS, ImageColorModel } from '../../IJS';
import { drawPoints } from '../drawPoints';

describe('drawPoints', () => {
  it('RGB image', () => {
    const image = testUtils.createRgbImage([
      [100, 150, 200, 100, 150, 200],
      [100, 150, 200, 100, 150, 200],
      [100, 150, 200, 100, 150, 200],
    ]);
    const points = [
      { row: 0, column: 0 },
      { row: 1, column: 1 },
    ];

    const result = image.drawPoints(points, { color: [255, 0, 0] });
    expect(result).toMatchImageData([
      [255, 0, 0, 100, 150, 200],
      [100, 150, 200, 255, 0, 0],
      [100, 150, 200, 100, 150, 200],
    ]);
    expect(result).not.toBe(image);
  });

  it('GREY image', () => {
    const image = testUtils.createGreyImage([
      [0, 0, 0, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
    ]);
    const points = [
      { row: 0, column: 0 },
      { row: 3, column: 3 },
      { row: 3, column: 0 },
    ];
    const result = image.drawPoints(points, {
      color: [1],
    });

    expect(result).toMatchImageData([
      [1, 0, 0, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
      [1, 0, 0, 1],
    ]);
    expect(result).not.toBe(image);
  });

  it('out parameter set to self', () => {
    const image = testUtils.createGreyImage([
      [0, 0, 0, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
    ]);
    const points = [
      { row: 0, column: 0 },
      { row: 1, column: 1 },
      { row: 2, column: 2 },
    ];
    const result = image.drawPoints(points, {
      color: [1],
      out: image,
    });

    expect(result).toMatchImageData([
      [1, 0, 0, 0],
      [0, 1, 0, 0],
      [0, 0, 1, 0],
      [0, 0, 0, 0],
    ]);
    expect(result).toBe(image);
  });

  it('out to other image', () => {
    const out = new IJS(4, 4, { colorModel: ImageColorModel.GREY });
    const image = testUtils.createGreyImage([
      [0, 0, 0, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
    ]);
    const points = [
      { row: 0, column: 0 },
      { row: 1, column: 0 },
      { row: 2, column: 0 },
    ];
    const result = image.drawPoints(points, {
      color: [1],
      out,
    });

    expect(result).toBe(out);
    expect(result).not.toBe(image);
  });

  it('mask', () => {
    const image = testUtils.createMask([
      [0, 0, 0, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
    ]);
    const points = [
      { row: 0, column: 0 },
      { row: 1, column: 0 },
      { row: 0, column: 1 },
    ];
    const result = image.drawPoints(points);
    expect(result).toMatchImageData([
      [1, 1, 0, 0],
      [1, 0, 0, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
    ]);
    expect(result).not.toBe(image);
  });
  it('default options', () => {
    const image = testUtils.createMask([
      [0, 0, 0, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
    ]);
    const points = [
      { row: 2, column: 2 },
      { row: 2, column: 0 },
      { row: 0, column: 2 },
    ];
    const result = drawPoints(image, points);
    expect(result).toMatchImageData([
      [0, 0, 1, 0],
      [0, 0, 0, 0],
      [1, 0, 1, 0],
      [0, 0, 0, 0],
    ]);
    expect(result).not.toBe(image);
  });
  it('different origin', () => {
    const image = testUtils.createMask([
      [0, 0, 0, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
    ]);
    const points = [
      { row: -1, column: -1 },
      { row: -1, column: 0 },
      { row: 0, column: 1 },
      { row: 0, column: 0 },
    ];
    const result = drawPoints(image, points, { origin: { column: 2, row: 2 } });
    expect(result).toMatchImageData([
      [0, 0, 0, 0],
      [0, 1, 1, 0],
      [0, 0, 1, 1],
      [0, 0, 0, 0],
    ]);
    expect(result).not.toBe(image);
  });
});
