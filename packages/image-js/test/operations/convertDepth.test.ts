import { ColorDepth, ImageKind } from 'ijs';
import { getImage } from 'test';

describe('convert depth', () => {
  it('Uint8 to Uint16', () => {
    const img = getImage([[1, 2], [3, 4]], ImageKind.GREY, ColorDepth.UINT8);

    const newImg = img.convertDepth(ColorDepth.UINT16);
    expect(newImg.width).toStrictEqual(2);
    expect(newImg.height).toStrictEqual(2);
    expect(newImg.depth).toStrictEqual(ColorDepth.UINT16);
    expect(newImg.kind).toStrictEqual(ImageKind.GREY);
    expect(Array.from(newImg.data)).toStrictEqual([256, 512, 768, 1024]);
  });

  it('Uint16 to Uint8', () => {
    const img = getImage(
      [[30, 260], [512, 2047]],
      ImageKind.GREY,
      ColorDepth.UINT16
    );

    const newImg = img.convertDepth(ColorDepth.UINT8);
    expect(newImg.width).toStrictEqual(2);
    expect(newImg.height).toStrictEqual(2);
    expect(newImg.depth).toStrictEqual(ColorDepth.UINT8);
    expect(newImg.kind).toStrictEqual(ImageKind.GREY);
    expect(Array.from(newImg.data)).toStrictEqual([0, 1, 2, 7]);
  });
});
