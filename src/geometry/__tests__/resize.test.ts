import { writeSync } from '../../save';

describe('resize', () => {
  it('compares result of resize with opencv', () => {
    const img = testUtils.load('opencv/test.png');

    const resized = img.resize({
      xFactor: 10,
      yFactor: 10,
    });

    writeSync('src/geometry/__tests__/resize.png', resized);

    expect(resized).toMatchImage('opencv/testResizeBilinear.png');
  });
});
