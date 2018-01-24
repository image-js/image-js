import getSeparatedKernel from '../getSeparatedKernel';

describe('getSeparatedKernel', () => {
  it('should return null if not separable', () => {
    expect(getSeparatedKernel([[3, 1, 2], [4, 5, 9], [6, 8, 10]])).toBeNull();
  });

  it('should return an array of kernel components', () => {
    verify([[1, 2, 1]]);
    verify([[0, 2, 1]]);
    verify([
      [1, 0, -1],
      [2, 0, -2],
      [1, 0, -1]
    ]);
  });
});

function verify(kernel) {
  const [v, h] = getSeparatedKernel(kernel);
  expect(v).toHaveLength(kernel.length);
  expect(h).toHaveLength(kernel[0].length);
  for (let i = 0; i < v.length; i++) {
    for (let j = 0; j < h.length; j++) {
      expect(v[i] * h[j]).toBeCloseTo(kernel[i][j], Number.EPSILON);
    }
  }
}
