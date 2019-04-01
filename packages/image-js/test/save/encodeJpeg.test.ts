import { encodeJpeg, decode, ColorDepth, Image, ImageKind } from 'ijs';
import { readImage } from 'test';

describe('encode JPEG', () => {
  it('decode the encoded jpeg returns image with same characteristics', () => {
    const buffer = readImage('rgb6.jpg');
    const image = decode(buffer);
    const encoded = encodeJpeg(image);
    const reloadedImage = decode(encoded);

    expect(image.width).toStrictEqual(reloadedImage.width);
    expect(image.height).toStrictEqual(reloadedImage.height);
    expect(image.kind).toStrictEqual(reloadedImage.kind);
  });
});
