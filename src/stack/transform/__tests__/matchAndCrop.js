import { Image, Stack, getHash } from 'test/common';

describe('check matchAndCrop method', function () {
  it('should return an array of 3 images cropped and moved using matchToPrevious', function () {
    let images = new Stack();

    images.push(
      new Image(5, 5,
        [
          0, 0, 0, 0, 0,
          0, 3, 1, 1, 1,
          0, 1, 2, 2, 2,
          0, 1, 2, 4, 3,
          0, 1, 2, 3, 3
        ],
        { kind: 'GREY' }
      )
    );

    images.push(
      new Image(5, 5,
        [
          0, 0, 0, 0, 0,
          0, 0, 0, 0, 0,
          0, 0, 4, 0, 0,
          0, 0, 0, 0, 0,
          0, 0, 0, 0, 0
        ],
        { kind: 'GREY' }
      )
    );

    images.push(
      new Image(5, 5,
        [
          0, 0, 0, 0, 0,
          0, 0, 4, 0, 0,
          0, 0, 0, 0, 0,
          0, 0, 0, 0, 0,
          0, 0, 0, 0, 0
        ],
        { kind: 'GREY' }
      )
    );

    images.push(
      new Image(5, 5,
        [
          0, 0, 0, 0, 0,
          0, 0, 0, 0, 0,
          0, 0, 4, 0, 0,
          0, 0, 0, 0, 0,
          0, 0, 0, 0, 0
        ],
        { kind: 'GREY' }
      )
    );

    images.push(
      new Image(5, 5,
        [
          0, 0, 0, 0, 0,
          0, 0, 4, 0, 0,
          0, 0, 0, 0, 0,
          0, 0, 0, 0, 0,
          0, 0, 0, 0, 0
        ],
        { kind: 'GREY' }
      )
    );

    let results = images.matchAndCrop();
    expect(results).toBeInstanceOf(Stack);
    expect(results).toHaveLength(5);
    expect(getHash(results[1])).toBe(getHash(results[2]));

    let result = results[0];
    expect(result.width).toBe(4);
    expect(result.height).toBe(3);
    expect(Array.from(result.data)).toStrictEqual([
      1, 2, 2, 2,
      1, 2, 4, 3,
      1, 2, 3, 3
    ]);


    result = results[1];
    expect(result.width).toBe(4);
    expect(result.height).toBe(3);
    expect(Array.from(result.data)).toStrictEqual([
      0, 0, 0, 0,
      0, 0, 4, 0,
      0, 0, 0, 0
    ]);

    result = results[2];
    expect(result.width).toBe(4);
    expect(result.height).toBe(3);
    expect(Array.from(result.data)).toStrictEqual([
      0, 0, 0, 0,
      0, 0, 4, 0,
      0, 0, 0, 0
    ]);

    result = results[3];
    expect(result.width).toBe(4);
    expect(result.height).toBe(3);
    expect(Array.from(result.data)).toStrictEqual([
      0, 0, 0, 0,
      0, 0, 4, 0,
      0, 0, 0, 0
    ]);

    result = results[4];
    expect(result.width).toBe(4);
    expect(result.height).toBe(3);
    expect(Array.from(result.data)).toStrictEqual([
      0, 0, 0, 0,
      0, 0, 4, 0,
      0, 0, 0, 0
    ]);
  });


  it('should return an array of 3 images cropped and moved unsng matchToFirst', function () {
    let images = new Stack();

    images.push(
      new Image(5, 5,
        [
          0, 0, 0, 0, 0,
          0, 3, 1, 1, 1,
          0, 1, 2, 2, 2,
          0, 1, 2, 4, 3,
          0, 1, 2, 3, 3
        ],
        { kind: 'GREY' }
      )
    );

    images.push(
      new Image(5, 5,
        [
          0, 0, 0, 0, 0,
          0, 0, 0, 0, 0,
          0, 0, 4, 0, 0,
          0, 0, 0, 0, 0,
          0, 0, 0, 0, 0
        ],
        { kind: 'GREY' }
      )
    );

    images.push(
      new Image(5, 5,
        [
          0, 0, 0, 0, 0,
          0, 0, 4, 0, 0,
          0, 0, 0, 0, 0,
          0, 0, 0, 0, 0,
          0, 0, 0, 0, 0
        ],
        { kind: 'GREY' }
      )
    );

    let results = images.matchAndCrop({ algorithm: 'matchToFirst' });
    expect(results).toBeInstanceOf(Stack);
    expect(results).toHaveLength(3);

    let result = results[0];
    expect(result.width).toBe(3);
    expect(result.height).toBe(4);
    expect(Array.from(result.data)).toStrictEqual([
      3, 1, 1,
      1, 2, 2,
      1, 2, 4,
      1, 2, 3
    ]);

    result = results[1];
    expect(result.width).toBe(3);
    expect(result.height).toBe(4);
    expect(Array.from(result.data)).toStrictEqual([
      0, 0, 0,
      0, 0, 0,
      0, 0, 4,
      0, 0, 0
    ]);

    result = results[2];
    expect(result.width).toBe(3);
    expect(result.height).toBe(4);
    expect(Array.from(result.data)).toStrictEqual([
      4, 0, 0,
      0, 0, 0,
      0, 0, 0,
      0, 0, 0
    ]);
  });

  it('should return an array of 3 images cropped and moved unsng matchToFirst simple', function () {
    let images = new Stack();

    images.push(
      new Image(5, 5,
        [
          0, 0, 0, 0, 0,
          0, 1, 1, 1, 1,
          0, 1, 2, 2, 2,
          0, 1, 2, 4, 3,
          0, 1, 2, 3, 3
        ],
        { kind: 'GREY' }
      )
    );

    images.push(
      new Image(5, 5,
        [
          0, 0, 0, 0, 0,
          0, 0, 0, 0, 0,
          0, 0, 4, 0, 0,
          0, 0, 0, 0, 0,
          0, 0, 0, 0, 0
        ],
        { kind: 'GREY' }
      )
    );

    images.push(
      new Image(5, 5,
        [
          0, 0, 0, 0, 0,
          0, 0, 4, 0, 0,
          0, 0, 0, 0, 0,
          0, 0, 0, 0, 0,
          0, 0, 0, 0, 0
        ],
        { kind: 'GREY' }
      )
    );

    let results = images.matchAndCrop({ algorithm: 'matchToFirst' });
    expect(results).toBeInstanceOf(Stack);
    expect(results).toHaveLength(3);

    expect(getHash(results[1])).toBe(getHash(results[2]));

    let result = results[0];
    expect(result.width).toBe(4);
    expect(result.height).toBe(3);
    expect(Array.from(result.data)).toStrictEqual([
      1, 2, 2, 2,
      1, 2, 4, 3,
      1, 2, 3, 3
    ]);

    result = results[1];
    expect(result.width).toBe(4);
    expect(result.height).toBe(3);
    expect(Array.from(result.data)).toStrictEqual([
      0, 0, 0, 0,
      0, 0, 4, 0,
      0, 0, 0, 0
    ]);

    result = results[2];
    expect(result.width).toBe(4);
    expect(result.height).toBe(3);
    expect(Array.from(result.data)).toStrictEqual([
      0, 0, 0, 0,
      0, 0, 4, 0,
      0, 0, 0, 0
    ]);
  });
});

