import { transform } from '..';

describe('transform with a transformation matrix', () => {
  it('compare result of translation with opencv', () => {
    const img = testUtils.load('opencv/test.png');
    const translation = [
      [1, 0, 2],
      [0, 1, 4],
    ];
    const transformed = transform(img, translation, {
      width: 16,
      height: 20,
    });

    expect(transformed).toMatchImage('opencv/testTranslation.png');
  });
});
