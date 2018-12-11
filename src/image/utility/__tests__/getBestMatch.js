import { Image } from 'test/common';

describe('check getBestMatch class', function () {
  it('should move the image to the bottom right', function () {
    let image1 = new Image(5, 5,
      [
        0, 0, 0, 0, 0,
        0, 1, 1, 1, 1,
        0, 1, 2, 2, 2,
        0, 1, 2, 3, 3,
        0, 1, 2, 3, 4
      ],
      { kind: 'GREY' }
    );

    let image2 = new Image(5, 5,
      [
        0, 0, 0, 0, 0,
        0, 0, 0, 0, 0,
        0, 0, 4, 0, 0,
        0, 0, 0, 0, 0,
        0, 0, 0, 0, 0
      ],
      { kind: 'GREY' }
    );

    expect(image1.getBestMatch(image2)).toStrictEqual([2, 2]);
  });

  it('should move the image to the bottom', function () {
    let image1 = new Image(5, 5,
      [
        0, 0, 0, 0, 0,
        0, 1, 1, 1, 0,
        0, 1, 2, 1, 0,
        0, 1, 3, 1, 0,
        0, 1, 4, 1, 0
      ],
      { kind: 'GREY' }
    );

    let image2 = new Image(5, 5,
      [
        0, 0, 0, 0, 0,
        0, 0, 0, 0, 0,
        0, 0, 4, 0, 0,
        0, 0, 0, 0, 0,
        0, 0, 0, 0, 0
      ],
      { kind: 'GREY' }
    );

    expect(image1.getBestMatch(image2)).toStrictEqual([0, 2]);
  });

  it('should move the image to the top left', function () {
    let image1 = new Image(5, 5,
      [
        6, 0, 0, 0, 0,
        0, 5, 1, 1, 0,
        0, 1, 2, 1, 0,
        0, 1, 3, 1, 0,
        0, 1, 4, 1, 0
      ],
      { kind: 'GREY' }
    );

    let image2 = new Image(5, 5,
      [
        0, 0, 0, 0, 0,
        0, 0, 0, 0, 0,
        0, 0, 6, 0, 0,
        0, 0, 0, 0, 0,
        0, 0, 0, 0, 0
      ],
      { kind: 'GREY' }
    );

    expect(image1.getBestMatch(image2)).toStrictEqual([-2, -2]);
  });
});
