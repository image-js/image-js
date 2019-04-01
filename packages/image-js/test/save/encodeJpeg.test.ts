import { encodeJpeg, decode } from 'ijs';
import { readImage, getImage } from 'test';

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

  it('encoding a 16-bit image should convert it to a 8-bit image', () => {
    // const image = getImage();
  });
});
