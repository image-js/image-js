import { writeSync } from '../../save';

describe('transform with a transformation matrix', () => {
  it('compare result of translation with opencv', () => {
    const img = testUtils.load('opencv/test.png');
    const translation = [
      [1, 0, 2],
      [0, 1, 4],
    ];
    const transformed = img.transform(translation, {
      width: 16,
      height: 20,
    });
    writeSync('src/geometry/__tests__/transformed.png', transformed);

    expect(transformed).toMatchImage('opencv/testTranslation.png');
  });

  // is this the expected result for the fullImage option??
  it.skip('fullImage = true', () => {
    const img = testUtils.load('opencv/test.png');
    const translation = [
      [1, 0, 2],
      [0, 1, 10],
    ];
    const transformed = img.transform(translation, {
      width: 16,
      height: 15,
      fullImage: true,
    });
    writeSync('src/geometry/__tests__/transformed-fullImage.png', transformed);

    expect(transformed).toMatchImage('opencv/testTranslation.png');
  });

  it('should throw if matrix has wrong size', () => {
    const img = testUtils.load('opencv/test.png');
    const translation = [
      [1, 0, 2, 3],
      [0, 1, 10, 4],
    ];
    expect(() => {
      img.transform(translation);
    }).toThrow('transform: transformation matrix must be 2x3, found 2x4');
  });
});
