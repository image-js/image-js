import { Image } from 'test/common';
import binary from 'test/binary';

describe('check the colorDepth transform', function () {
  it('check the right colorDepth for GREY image 8 bit', function () {
    let image = new Image(4, 1, [0x00, 0x7f, 0xff, 0x12], { kind: 'GREY' });

    let newImage = image.colorDepth(8);
    expect(Array.from(newImage.data)).toStrictEqual([0x00, 0x7f, 0xff, 0x12]);

    newImage = image.colorDepth(16);
    expect(Array.from(newImage.data)).toStrictEqual([0x0000, 0x7f7f, 0xffff, 0x1212]);
  });

  it('check the right colorDepth for MASK to 8 bit', function () {
    let image = new Image(4, 2, binary`
        0101
        0101
    `, { kind: 'BINARY' });
    let newImage = image.colorDepth(8);
    expect(Array.from(newImage.data)).toStrictEqual([
      0, 255, 0, 255,
      0, 255, 0, 255
    ]);

    newImage = image.colorDepth(16);
    expect(Array.from(newImage.data)).toStrictEqual([
      0, 65535, 0, 65535,
      0, 65535, 0, 65535
    ]);
  });

  it('check the right colorDepth for GREY image 16 bit', function () {
    let image = new Image(4, 1, [0x0000, 0x7fff, 0xffff, 0x1234], {
      kind: 'GREY',
      bitDepth: 16
    });

    let newImage = image.colorDepth(8);
    expect(Array.from(newImage.data)).toStrictEqual([0x00, 0x7f, 0xff, 0x12]);

    newImage = image.colorDepth(16);
    expect(Array.from(newImage.data)).toStrictEqual([0x0000, 0x7fff, 0xffff, 0x1234]);

    (expect(function () {
      image.colorDepth(15);
    }).toThrow(/You need to specify the new colorDepth as 8 or 16/));
  });
});
