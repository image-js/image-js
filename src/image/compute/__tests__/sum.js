import { Image } from 'test/common';

describe('check sum', function () {
  it('should yield the correct array', function () {
    let image = new Image(1, 2, [230, 83, 120, 255, 100, 140, 13, 1]);

    expect(image.sum).toStrictEqual([330, 223, 133, 256]);
    expect(image.getSum()).toStrictEqual([330, 223, 133, 256]);
  });
});

