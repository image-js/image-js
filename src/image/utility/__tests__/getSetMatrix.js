import { Image } from 'test/common';

describe('check getMatrix class', function () {
  it('should yield a Matrix object', function () {
    let image = new Image(5, 4,
      [
        0, 0, 0, 0, 0,
        0, 1, 1, 1, 1,
        0, 1, 2, 2, 2,
        0, 1, 3, 3, 3
      ],
      { kind: 'GREY' }
    );

    let matrix = image.getMatrix();

    expect(matrix.columns).toBe(5);
    expect(matrix.rows).toBe(4);
    expect(matrix[2]).toStrictEqual([0, 1, 2, 2, 2]);

    let image2 = new Image(5, 4, { kind: 'GREY' });
    image2.setMatrix(matrix);

    expect(image.data).toStrictEqual(Array.from(image2.data));
  });
});
