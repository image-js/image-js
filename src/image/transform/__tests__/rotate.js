import { Image, getHash } from 'test/common';

describe('check the rotate transform', function () {
  it('90 degrees clockwise grey', function () {
    const image = new Image(3, 2, [1, 2, 3, 4, 5, 6], { kind: 'GREY' });

    const result = image.rotateRight();
    expect(result.width).toBe(2);
    expect(result.height).toBe(3);
    expect(Array.from(result.data)).toStrictEqual([4, 1, 5, 2, 6, 3]);
  });

  it('90 degrees counter-clockwise grey', function () {
    const image = new Image(3, 2, [1, 2, 3, 4, 5, 6], { kind: 'GREY' });

    const result = image.rotateLeft();
    expect(result.width).toBe(2);
    expect(result.height).toBe(3);
    expect(Array.from(result.data)).toStrictEqual([3, 6, 2, 5, 1, 4]);
  });

  it('180 degrees grey', function () {
    const image = new Image(3, 2, [1, 2, 3, 4, 5, 6], { kind: 'GREY' });

    const result = image.rotate(180);
    expect(Array.from(result.data)).toStrictEqual([6, 5, 4, 3, 2, 1]);
  });

  it('No actual rotation', function () {
    const image = new Image(3, 2, [1, 2, 3, 4, 5, 6], { kind: 'GREY' });

    const result = image.rotate(360);
    expect(getHash(result)).toStrictEqual(getHash(image));
  });

  it('45 degrees binary', function () {
    const image = new Image(
      8,
      8,
      [0x00, 0x00, 0x3c, 0x3c, 0x3c, 0x3c, 0x00, 0x00],
      { kind: 'BINARY' },
    );

    const result = image.rotate(45);
    expect(Array.from(result.data)).toStrictEqual([
      241, 252, 31, 17, 199, 17, 241, 62, 115, 159, 39, 241, 255, 127, 255, 128,
    ]);
  });

  it('90 degrees binary', function () {
    const image = new Image(8, 4, [0x00, 0x00, 0xaa, 0x55], { kind: 'BINARY' });

    const result = image.rotate(90);
    expect(Array.from(result.data)).toStrictEqual([0x48, 0x48, 0x48, 0x48]);
  });

  it('180 degrees binary', function () {
    const image = new Image(8, 4, [0x00, 0x00, 0xaa, 0x55], { kind: 'BINARY' });

    const result = image.rotate(180);
    expect(Array.from(result.data)).toStrictEqual([0xaa, 0x55, 0x00, 0x00]);
  });

  it('270 degrees binary', function () {
    const image = new Image(
      8,
      8,
      [0x00, 0x00, 0x3c, 0x3c, 0x3c, 0x3c, 0x00, 0x00],
      { kind: 'BINARY' },
    );

    const result = image.rotate(270);
    expect(getHash(result)).toStrictEqual(getHash(image));
  });

  it('negative angle grey', function () {
    const image = new Image(3, 2, [1, 2, 3, 4, 5, 6], { kind: 'GREY' });
    const rotate90 = image.rotate(90);
    const rotateMin270 = image.rotate(-270);
    expect(Array.from(rotate90.data)).toStrictEqual(
      Array.from(rotateMin270.data),
    );
  });

  it('invalid argument types', function () {
    expect(function () {
      const image = new Image(3, 2, [1, 2, 3, 4, 5, 6], { kind: 'GREY' });
      image.rotate('45°');
    }).toThrow(/angle must be a number/);
  });
});
