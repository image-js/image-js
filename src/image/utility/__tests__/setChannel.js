import { Image } from 'test/common';

describe('get a specific channel from an image', function () {
  it('should check channels from a RGBA image', function () {
    let image = new Image(1, 2);

    let red = new Image(1, 2, [230, 100], {
      kind: 'GREY'
    });
    image.setChannel(0, red);

    let green = new Image(1, 2, [83, 140], {
      kind: 'GREY'
    });
    image.setChannel('g', green);

    let blue = new Image(1, 2, [120, 13], {
      kind: 'GREY'
    });
    image.setChannel(2, blue);

    let alpha = new Image(1, 2, [55, 77], {
      kind: 'GREY'
    });
    image.setChannel('a', alpha);

    expect(image.components).toBe(3);
    expect(image.channels).toBe(4);
    expect(image.bitDepth).toBe(8);
    expect(Array.from(image.data)).toStrictEqual([230, 83, 120, 55, 100, 140, 13, 77]);
  });
});

