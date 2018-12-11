import { Image } from 'test/common';

describe('cropAlpha transform', function () {
  it('grey + alpha - no crop', function () {
    const image = new Image(3, 4, [
      1, 255, 2, 255, 3, 255,
      4, 255, 5, 255, 6, 255,
      7, 255, 8, 255, 9, 255,
      10, 255, 11, 255, 12, 255
    ], { kind: 'GREYA' });

    const cropped = image.cropAlpha();
    expect(cropped.width).toBe(image.width);
    expect(cropped.height).toBe(image.height);
    expect(Array.from(cropped.data)).toStrictEqual(Array.from(image.data));
  });

  it('grey + alpha - some crop', function () {
    const image = new Image(3, 4, [
      1, 0, 2, 255, 3, 255,
      4, 0, 5, 255, 6, 255,
      7, 0, 8, 255, 9, 255,
      10, 0, 11, 0, 12, 0
    ], { kind: 'GREYA' });

    const cropped = image.cropAlpha();
    expect(cropped.width).toBe(2);
    expect(cropped.height).toBe(3);
    expect(Array.from(cropped.data)).toStrictEqual([
      2, 255, 3, 255,
      5, 255, 6, 255,
      8, 255, 9, 255,
    ]);
  });

  it('grey + alpha - only one remains', function () {
    const image = new Image(3, 4, [
      1, 0, 2, 0, 3, 0,
      4, 0, 5, 255, 6, 0,
      7, 0, 8, 0, 9, 0,
      10, 0, 11, 0, 12, 0
    ], { kind: 'GREYA' });

    const cropped = image.cropAlpha();
    expect(cropped.width).toBe(1);
    expect(cropped.height).toBe(1);
    expect(Array.from(cropped.data)).toStrictEqual([5, 255]);
  });

  it('grey + alpha - with threshold', function () {
    const image = new Image(3, 4, [
      1, 0, 2, 240, 3, 0,
      4, 110, 5, 255, 6, 250,
      7, 110, 8, 239, 9, 250,
      10, 10, 11, 0, 12, 90
    ], { kind: 'GREYA' });

    const cropped = image.cropAlpha({ threshold: 240 });
    expect(cropped.width).toBe(2);
    expect(cropped.height).toBe(3);
    expect(Array.from(cropped.data)).toStrictEqual([
      2, 240, 3, 0,
      5, 255, 6, 250,
      8, 239, 9, 250,
    ]);
  });

  it('grey + alpha - error high threshold', function () {
    const image = new Image(3, 4, [
      1, 40, 2, 240, 3, 50,
      4, 110, 5, 0, 6, 250,
      7, 110, 8, 239, 9, 250,
      10, 10, 11, 0, 12, 90
    ], { kind: 'GREYA' });


    expect(function () {
      image.cropAlpha();
    }).toThrow(/Could not find new dimensions. Threshold may be too high./);
  });
});
