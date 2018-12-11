import { Image } from 'test/common';

describe('check median', function () {
  it('for a GREY even image', function () {
    let image = new Image(4, 3,
      [
        1, 1, 1, 1,
        2, 2, 2, 2,
        3, 3, 3, 3
      ],
      { kind: 'GREY' }
    );

    expect(image.median).toStrictEqual([2]);
  });

  it('for a GREY odd image', function () {
    let image = new Image(3, 3,
      [
        1, 1, 1,
        2, 2, 2,
        3, 3, 3
      ],
      { kind: 'GREY' }
    );

    expect(image.median).toStrictEqual([2]);
  });

  it('for a RGBA image', function () {
    let image = new Image(1, 3,
      [
        1, 2, 3, 255,
        2, 3, 4, 255,
        3, 4, 5, 255
      ]
    );
    expect(image.median).toStrictEqual([2, 3, 4]);
  });

  it('for a RGBA image with alpha', function () {
    let image = new Image(1, 3,
      [
        1, 2, 3, 100,
        2, 3, 4, 100,
        3, 4, 5, 200
      ]
    );

    expect(image.median).toStrictEqual([2.5, 3.5, 4.5]);
  });
});

