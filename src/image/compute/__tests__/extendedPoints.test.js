import binary from 'test/binary';

describe('extendedPoints', function () {
  it('check the array', function () {
    const image = binary`
     0000
     0110
     0100
     0000
   `;

    expect(image.getExtendedPoints()).toStrictEqual([
      [1, 1],
      [2, 1],
      [3, 1],
      [3, 2],
      [2, 2],
      [1, 2],
      [2, 2],
      [2, 3],
      [1, 3],
    ]);
    expect(image.extendedPoints).toStrictEqual([
      [1, 1],
      [2, 1],
      [3, 1],
      [3, 2],
      [2, 2],
      [1, 2],
      [2, 2],
      [2, 3],
      [1, 3],
    ]);
  });

  it('2 points', function () {
    const image = binary`
     1
     1
   `;

    expect(image.getExtendedPoints()).toStrictEqual([
      [0, 0],
      [1, 0],
      [1, 1],
      [0, 1],
      [1, 1],
      [1, 2],
      [0, 2],
    ]);
    expect(image.extendedPoints).toStrictEqual([
      [0, 0],
      [1, 0],
      [1, 1],
      [0, 1],
      [1, 1],
      [1, 2],
      [0, 2],
    ]);
  });
});
