import Matrix from '../matrix';

describe('check matrix class', function () {
  let matrix = new Matrix(9, 5, 1);
  matrix[4][2] = 2;
  matrix[4][3] = 3;
  matrix[4][4] = 4;
  matrix[4][5] = 5;

  it('check localMax', function () {
    let max = matrix.localMax(4, 3);
    expect(max.value).toBe(4);
    expect(max.position).toStrictEqual([4, 4]);
  });

  it('check localMin', function () {
    let min = matrix.localMin(4, 3);
    expect(min.value).toBe(1);
    expect(min.position).toStrictEqual([3, 2]);
  });

  it('check localSearch', function () {
    let results = matrix.localSearch(4, 3, 1);
    expect(results).toStrictEqual([[3, 2], [3, 3], [3, 4], [5, 2], [5, 3], [5, 4]]);
  });
});

