import { Image } from 'test/common';

describe('Find local extrema', function () {
  it('maximum for a GREY image', function () {
    let image = new Image(10, 10,
      [
        1, 1, 1, 1, 1, 1, 1, 1, 1, 1,
        1, 1, 1, 1, 1, 1, 1, 1, 1, 1,
        1, 1, 1, 4, 1, 1, 1, 1, 1, 1,
        1, 1, 1, 1, 1, 1, 1, 1, 1, 1,
        1, 1, 1, 1, 1, 1, 1, 1, 1, 1,
        1, 1, 1, 1, 1, 1, 1, 1, 1, 1,
        1, 1, 1, 1, 1, 1, 1, 1, 1, 1,
        1, 1, 1, 1, 1, 1, 4, 1, 1, 1,
        1, 1, 1, 1, 1, 1, 1, 1, 1, 1,
        1, 1, 1, 1, 1, 1, 1, 1, 1, 1

      ],
      { kind: 'GREY' }
    );
    expect(image.getLocalMaxima()).toStrictEqual([[3, 2], [6, 7]]);
  });

  it('minimum for a GREY image', function () {
    let image = new Image(10, 10,
      [
        5, 5, 5, 5, 5, 5, 5, 5, 5, 5,
        5, 5, 5, 5, 5, 5, 5, 5, 5, 5,
        5, 5, 5, 2, 5, 5, 5, 5, 5, 5,
        5, 5, 5, 5, 5, 5, 5, 5, 5, 5,
        5, 5, 5, 5, 5, 5, 5, 5, 5, 5,
        5, 5, 5, 5, 5, 5, 5, 5, 5, 5,
        5, 5, 5, 5, 5, 5, 5, 5, 5, 5,
        5, 5, 5, 5, 5, 5, 2, 5, 5, 5,
        5, 5, 5, 5, 5, 5, 5, 5, 5, 5,
        5, 5, 5, 5, 5, 5, 5, 5, 5, 5

      ],
      { kind: 'GREY' }
    );

    expect(image.getLocalMaxima({ invert: true })).toStrictEqual([[3, 2], [6, 7]]);
    expect(image.getLocalMaxima({
      invert: true,
      region: 3,
      maxEquals: 0
    })).toStrictEqual([[3, 2], [6, 7]]);
  });

  it('maximum for a GREY image with merge', function () {
    let image = new Image(10, 10,
      [
        1, 1, 1, 1, 1, 1, 1, 1, 1, 1,
        1, 1, 1, 1, 1, 1, 1, 1, 1, 1,
        1, 1, 4, 4, 4, 1, 1, 1, 1, 1,
        1, 1, 1, 1, 1, 1, 1, 1, 1, 1,
        1, 1, 1, 1, 1, 1, 1, 1, 1, 1,
        1, 1, 1, 1, 1, 1, 1, 1, 1, 1,
        1, 1, 1, 1, 1, 1, 1, 1, 1, 1,
        1, 1, 1, 1, 1, 1, 2, 1, 1, 1,
        1, 1, 1, 1, 1, 1, 1, 1, 1, 1,
        1, 1, 1, 1, 1, 1, 1, 1, 1, 1
      ],
      { kind: 'GREY' }
    );
    expect(image.getLocalMaxima(
      { removeClosePoints: 3, region: 1 }
    )).toStrictEqual([[3, 2], [6, 7]]);
  });

  it('maximum for a GREY image with all smaller', function () {
    let image = new Image(10, 10,
      [
        1, 1, 1, 1, 1, 1, 1, 1, 1, 1,
        1, 1, 1, 1, 1, 1, 1, 1, 1, 1,
        1, 1, 4, 4, 4, 1, 1, 1, 1, 1,
        1, 1, 1, 1, 1, 1, 1, 1, 1, 1,
        1, 1, 1, 1, 1, 1, 1, 1, 1, 1,
        1, 1, 1, 1, 1, 1, 1, 1, 1, 1,
        1, 1, 1, 1, 1, 1, 1, 1, 1, 1,
        1, 1, 1, 1, 1, 1, 2, 1, 1, 1,
        1, 1, 1, 1, 1, 1, 1, 1, 1, 1,
        1, 1, 1, 1, 1, 1, 1, 1, 1, 1
      ],
      { kind: 'GREY' }
    );
    expect(image.getLocalMaxima(
      { removeClosePoints: 3, region: 1, maxEquals: 0 }
    )).toStrictEqual([[6, 7]]);
    expect(image.getLocalMaxima(
      { removeClosePoints: 3, region: 2, maxEquals: 0 }
    )).toStrictEqual([[6, 7]]);
    expect(image.getLocalMaxima(
      { removeClosePoints: 3, region: 3, maxEquals: 0 }
    )).toStrictEqual([[6, 7]]);
  });
});
