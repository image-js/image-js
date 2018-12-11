import { Image } from 'test/common';

describe('Grey transform', function () {
  it('RGBA image', function () {
    let image = new Image(2, 1, [100, 150, 200, 255, 100, 150, 200, 0]);

    expect(
      Array.from(
        image.grey({
          algorithm: (red, green, blue) => Math.min(red, green, blue)
        }).data
      )
    ).toStrictEqual([100, 0]);

    expect(Array.from(image.grey().data)).toStrictEqual([142, 0]);
    expect(Array.from(image.grey({ algorithm: 'min' }).data)).toStrictEqual([100, 0]);
    expect(Array.from(image.grey({ algorithm: 'minimum' }).data)).toStrictEqual([
      100,
      0
    ]);
    expect(Array.from(image.grey({ algorithm: 'max' }).data)).toStrictEqual([200, 0]);
    expect(Array.from(image.grey({ algorithm: 'maximum' }).data)).toStrictEqual([
      200,
      0
    ]);
    expect(Array.from(image.grey({ algorithm: 'brightness' }).data)).toStrictEqual([
      200,
      0
    ]);
    expect(Array.from(image.grey({ algorithm: 'red' }).data)).toStrictEqual([100, 0]);
    expect(Array.from(image.grey({ algorithm: 'green' }).data)).toStrictEqual([
      150,
      0
    ]);
    expect(Array.from(image.grey({ algorithm: 'blue' }).data)).toStrictEqual([
      200,
      0
    ]);
    expect(Array.from(image.grey({ algorithm: 'magenta' }).data)).toStrictEqual([
      63,
      0
    ]);
    expect(Array.from(image.grey({ algorithm: 'cyan' }).data)).toStrictEqual([
      127,
      0
    ]);
    expect(Array.from(image.grey({ algorithm: 'yellow' }).data)).toStrictEqual([
      0,
      0
    ]);
    expect(Array.from(image.grey({ algorithm: 'black' }).data)).toStrictEqual([
      55,
      0
    ]);
    expect(Array.from(image.grey({ algorithm: 'hue' }).data)).toStrictEqual([148, 0]);
    expect(Array.from(image.grey({ algorithm: 'saturation' }).data)).toStrictEqual([
      128,
      0
    ]);
    expect(Array.from(image.grey({ algorithm: 'lightness' }).data)).toStrictEqual([
      150,
      0
    ]);
    expect(Array.from(image.grey({ algorithm: 'luminosity' }).data)).toStrictEqual([
      150,
      0
    ]);
    expect(Array.from(image.grey({ algorithm: 'luminance' }).data)).toStrictEqual([
      150,
      0
    ]);

    expect(Array.from(image.grey({ keepAlpha: true }).data)).toStrictEqual([
      142,
      255,
      142,
      0
    ]);

    expect(Array.from(image.grey({ mergeAlpha: true }).data)).toStrictEqual([142, 0]);

    expect(
      Array.from(image.grey({ algorithm: 'average', keepAlpha: true }).data)
    ).toStrictEqual([150, 255, 150, 0]);

    expect(
      Array.from(image.grey({ algorithm: 'maximum', keepAlpha: true }).data)
    ).toStrictEqual([200, 255, 200, 0]);

    expect(
      Array.from(image.grey({ algorithm: 'minmax', keepAlpha: true }).data)
    ).toStrictEqual([150, 255, 150, 0]);

    expect(
      Array.from(image.grey({ algorithm: 'luma601', keepAlpha: true }).data)
    ).toStrictEqual([140, 255, 140, 0]);

    expect(
      Array.from(image.grey({ algorithm: 'luma709', keepAlpha: true }).data)
    ).toStrictEqual([142, 255, 142, 0]);

    expect(function () {
      image.grey({ algorithm: 'XXX' });
    }).toThrow(/unsupported grey algorithm: XXX/);
  });

  it('GREYA image', function () {
    let image = new Image(2, 1, [100, 255, 150, 0], { kind: 'GREYA' });

    expect(Array.from(image.grey().data)).toStrictEqual([100, 0]);
    expect(Array.from(image.grey({ mergeAlpha: false }).data)).toStrictEqual([
      100,
      150
    ]);

    expect(Array.from(image.grey({ keepAlpha: true }).data)).toStrictEqual([
      100,
      255,
      150,
      0
    ]);
  });

  it('user-provided output', () => {
    const image = new Image(2, 1, [100, 150, 200, 255, 100, 150, 200, 0]);

    const out = new Image(2, 1, { kind: 'GREY' });
    const result = image.grey({ out });
    expect(result).toBe(out);
    expect(Array.from(out.data)).toStrictEqual([142, 0]);

    const wrongOut = new Image(2, 1, { kind: 'GREYA' });
    expect(() => image.grey({ out: wrongOut })).toThrow(
      /cannot use out\. Its alpha must be "0" \(found "1"\)/
    );
  });
});
