import { encodeJpeg, decode, ColorDepth, ImageKind } from 'ijs';
import { getImage, decodeImage } from 'test';

describe('encode JPEG', () => {
  it('encode an 8-bit rgba image', () => {
    const image = getImage(
      [[[1, 1, 1, 255], [2, 2, 2, 255]], [[3, 3, 3, 255], [4, 4, 4, 255]]],
      ImageKind.RGBA,
      ColorDepth.UINT8
    );

    const encoded = encodeJpeg(image);

    const reloaded = decode(encoded);
    expect(reloaded.width).toStrictEqual(2);
    expect(reloaded.height).toStrictEqual(2);
    expect(reloaded.kind).toStrictEqual(ImageKind.RGBA);
    expect(reloaded.depth).toStrictEqual(ColorDepth.UINT8);
  });
  it('decode the encoded jpeg returns image with same characteristics', () => {
    const image = decodeImage('rgb6.jpg');
    const encoded = encodeJpeg(image);
    const reloadedImage = decode(encoded);

    expect(image.width).toStrictEqual(reloadedImage.width);
    expect(image.height).toStrictEqual(reloadedImage.height);
    expect(image.kind).toStrictEqual(reloadedImage.kind);
  });

  it('encoding a 16-bit image should convert it to a 8-bit image', () => {
    const image = getImage(
      [[256, 512], [768, 1024]],
      ImageKind.GREY,
      ColorDepth.UINT16
    );
    const encoded = encodeJpeg(image);
    const reloaded = decode(encoded);
    expect(reloaded.width).toStrictEqual(2);
    expect(reloaded.height).toStrictEqual(2);
    expect(reloaded.kind).toStrictEqual(ImageKind.RGBA);
    expect(reloaded.depth).toStrictEqual(ColorDepth.UINT8);
  });
});
