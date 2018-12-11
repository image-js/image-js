import { Image } from 'test/common';

describe('check the rotate transform', function () {
  it('90 degrees clockwise grey', function () {
    const image = new Image(3, 2,
      [
        1, 2, 3,
        4, 5, 6
      ],
      { kind: 'GREY' });

    const result = image.rotateRight();
    expect(result.width).toBe(2);
    expect(result.height).toBe(3);
    expect(Array.from(result.data)).toStrictEqual([
      4, 1,
      5, 2,
      6, 3
    ]);
  });

  it('90 degrees counter-clockwise grey', function () {
    const image = new Image(3, 2,
      [
        1, 2, 3,
        4, 5, 6
      ],
      { kind: 'GREY' });

    const result = image.rotateLeft();
    expect(result.width).toBe(2);
    expect(result.height).toBe(3);
    expect(Array.from(result.data)).toStrictEqual([
      3, 6,
      2, 5,
      1, 4
    ]);
  });


  it('180 degrees grey', function () {
    const image = new Image(3, 2,
      [
        1, 2, 3,
        4, 5, 6
      ],
      { kind: 'GREY' });

    const result = image.rotate(180);
    expect(Array.from(result.data)).toStrictEqual([
      6, 5, 4,
      3, 2, 1
    ]);
  });

  it('negative angle grey', function () {
    const image = new Image(3, 2,
      [
        1, 2, 3,
        4, 5, 6
      ],
      { kind: 'GREY' });
    const rotate90 = image.rotate(90);
    const rotateMin270 = image.rotate(-270);
    expect(Array.from(rotate90.data)).toStrictEqual(Array.from(rotateMin270.data));
  });
});
