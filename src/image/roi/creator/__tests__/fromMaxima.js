import { Image } from 'test/common';

import fromMaxima from '../fromMaxima';

describe('we check fromMaxima only looking for top', function () {
  it('should yield the right map large top', function () {
    let image = new Image(5, 5,
      [
        0, 0, 0, 0, 0,
        0, 3, 1, 1, 1,
        0, 1, 4, 4, 2,
        0, 1, 4, 4, 3,
        0, 1, 2, 3, 3
      ],
      { kind: 'GREY' }
    );

    let data = fromMaxima.call(image,
      { onlyTop: true }
    ).data;

    expect(Array.from(data)).toStrictEqual([
      0, 0, 0, 0, 0,
      0, 0, 0, 0, 0,
      0, 0, 1, 1, 0,
      0, 0, 1, 1, 0,
      0, 0, 0, 0, 0
    ]);
  });

  it('should yield the right map NO top', function () {
    let image = new Image(5, 5,
      [
        0, 0, 0, 5, 0,
        0, 3, 1, 1, 1,
        0, 1, 4, 4, 2,
        0, 1, 4, 4, 3,
        0, 1, 2, 3, 5
      ],
      { kind: 'GREY' }
    );

    let data = fromMaxima.call(image,
      { onlyTop: true }
    ).data;

    expect(Array.from(data)).toStrictEqual([
      0, 0, 0, 0, 0,
      0, 0, 0, 0, 0,
      0, 0, 0, 0, 0,
      0, 0, 0, 0, 0,
      0, 0, 0, 0, 0
    ]);
  });

  it('should yield the right map 2 tops', function () {
    let image = new Image(5, 5,
      [
        0, 0, 0, 0, 0,
        0, 3, 1, 1, 1,
        0, 1, 1, 4, 2,
        0, 1, 4, 4, 3,
        0, 1, 2, 3, 3
      ],
      { kind: 'GREY' }
    );

    let data = fromMaxima.call(image,
      { onlyTop: true }
    ).data;

    expect(Array.from(data)).toStrictEqual([
      0, 0, 0, 0, 0,
      0, 1, 0, 0, 0,
      0, 0, 0, 2, 0,
      0, 0, 2, 2, 0,
      0, 0, 0, 0, 0
    ]);
  });

  it('should yield the right map symmetric', function () {
    let image = new Image(5, 5,
      [
        0, 0, 0, 0, 0,
        0, 1, 1, 1, 0,
        0, 1, 0, 0, 0,
        0, 1, 0, 2, 2,
        0, 0, 0, 2, 2
      ],
      { kind: 'GREY' }
    );

    let data = fromMaxima.call(image,
      { onlyTop: true }
    ).data;

    expect(Array.from(data)).toStrictEqual([
      0, 0, 0, 0, 0,
      0, 1, 1, 1, 0,
      0, 1, 0, 0, 0,
      0, 1, 0, 0, 0,
      0, 0, 0, 0, 0
    ]);
  });
});


describe('we check fromMaxima only looking for maxima', function () {
  it('should yield the right map large top', function () {
    let image = new Image(5, 5,
      [
        0, 0, 0, 0, 0,
        0, 3, 1, 1, 1,
        0, 1, 4, 4, 2,
        0, 1, 4, 4, 3,
        0, 1, 2, 3, 3
      ],
      { kind: 'GREY' }
    );

    let data = fromMaxima.call(image,
      {}
    ).data;

    expect(Array.from(data)).toStrictEqual([
      1, 1, 1, 1, 1,
      1, 1, 1, 1, 1,
      1, 1, 1, 1, 1,
      1, 1, 1, 1, 1,
      1, 1, 1, 1, 1
    ]);
  });

  it('should yield the right map one roi', function () {
    let image = new Image(5, 5,
      [
        0, 0, 0, 5, 0,
        0, 0, 0, 0, 0,
        0, 0, 4, 4, 2,
        0, 0, 4, 4, 3,
        0, 0, 2, 3, 3
      ],
      { kind: 'GREY' }
    );

    let data = fromMaxima.call(image).data;

    expect(Array.from(data)).toStrictEqual([
      1, 1, 1, 0, 1,
      1, 1, 1, 1, 1,
      1, 1, 1, 1, 1,
      1, 1, 1, 1, 1,
      1, 1, 1, 1, 1
    ]);
  });

  it.skip('should yield the right map 2 roi', function () {
    let image = new Image(5, 5,
      [
        0, 0, 0, 0, 0,
        0, 3, 0, 0, 0,
        0, 0, 0, 4, 0,
        0, 0, 4, 4, 0,
        0, 0, 0, 0, 0
      ],
      { kind: 'GREY' }
    );

    let data = fromMaxima.call(image).data;

    expect(Array.from(data)).toStrictEqual([
      1, 1, 1, 1, 1,
      1, 1, 1, 2, 2,
      1, 1, 1, 2, 2,
      1, 2, 2, 2, 2,
      1, 2, 2, 2, 2
    ]);
  });
});
