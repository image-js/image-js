import { Image, getHash } from 'test/common';

describe('check the crop transform', function () {
  let image;
  beforeEach(function () {
    image = new Image(5, 5,
      [
        0, 0, 0, 0, 0,
        0, 1, 1, 1, 1,
        0, 1, 2, 2, 2,
        0, 1, 2, 4, 3,
        0, 1, 2, 3, 3
      ],
      { kind: 'GREY' }
    );
  });

  it('check the right extract for GREY image', function () {
    let result = image.crop({
      x: 0,
      y: 0
    });

    expect(getHash(result)).toBe(getHash(image));

    result = image.crop({
      x: 2,
      y: 2
    });
    expect(Array.from(result.data)).toStrictEqual([2, 2, 2, 2, 4, 3, 2, 3, 3]);

    result = image.crop({
      x: 0,
      y: 0,
      height: 2,
      width: 2
    });
    expect(Array.from(result.data)).toStrictEqual([0, 0, 0, 1]);


    result = image.crop({
      x: 2,
      y: 2,
      height: 2,
      width: 2
    });
    expect(Array.from(result.data)).toStrictEqual([2, 2, 2, 4]);

    result = image.crop({
      x: 1,
      y: 3,
      height: 1,
      width: 4
    });
    expect(Array.from(result.data)).toStrictEqual([1, 2, 4, 3]);
  });

  it('check crop + grey parenting', function () {
    let original = image;
    image = image.rgba8();
    expect(image.parent).toBe(original);
    let result = image.crop({
      x: 2,
      y: 3
    });
    let grey = result.grey();
    expect(grey.parent).toBe(result);
    expect(grey.position).toStrictEqual([0, 0]);
    expect(grey.parent.parent).toBe(image);
    expect(grey.parent.position).toStrictEqual([2, 3]);
  });

  it('non-integer arguments', function () {
    let result = image.crop({
      x: 1.2,
      y: 2.8,
      height: 1.1,
      width: 3.7
    });
    expect(Array.from(result.data)).toStrictEqual([1, 2, 4, 3]);
  });

  it('invalid argument ranges', function () {
    expect(function () {
      image.crop({
        x: -2,
        y: 2,
        height: 2,
        width: 2
      });
    }).toThrow(/x and y .* must be positive numbers/);

    expect(function () {
      image.crop({
        x: 2,
        y: 2,
        height: -2,
        width: 2
      });
    }).toThrow(/width and height .* must be positive numbers/);

    expect(function () {
      image.crop({
        x: 100,
        y: 2,
        height: 2,
        width: 2
      });
    }).toThrow(/origin .* out of range/);

    expect(function () {
      image.crop({
        x: 2,
        y: 2,
        height: 2,
        width: 100
      });
    }).toThrow(/size is out of range/);
  });
});

