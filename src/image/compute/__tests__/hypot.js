import { Image } from 'test/common';

describe('check hypotenuse', function () {
  it('should yield the correct array', function () {
    let image1 = new Image(5, 1,
      [3, 5, 8, 7, 9],
      { kind: 'GREY' }
    );

    let image2 = new Image(5, 1,
      [4, 12, 15, 24, 40],
      { kind: 'GREY' }
    );


    let theoretical =
            [5, 13, 17, 25, 41];

    expect(Array.from(image1.hypotenuse(image2).data)).toStrictEqual(theoretical);
  });
});

