import pointsMinMax from '../pointsMinMax';

describe('pointsMinMax', function () {
  it('one points', function () {
    expect(pointsMinMax([[1, 1]])).toStrictEqual({
      maxX: 1,
      maxY: 1,
      minX: 1,
      minY: 1,
    });
  });

  it('negative points', function () {
    expect(
      pointsMinMax([
        [-1, -1],
        [2, 2],
        [1, 1],
        [-2, -2],
      ]),
    ).toStrictEqual({
      maxX: 2,
      maxY: 2,
      minX: -2,
      minY: -2,
    });
  });
});
