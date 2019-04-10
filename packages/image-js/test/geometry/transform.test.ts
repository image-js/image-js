import { getTestImage } from 'test';
import { transform, readSync, writeSync } from 'ijs';

describe('transform with a transformation matrix', () => {
  it('compare result of translation with opencv', () => {
    const img = getTestImage();
    const translation = [[1, 0, 2], [0, 1, 4]];
    const transformed = transform(img, translation, {
      width: 16,
      height: 20
    });

    const expected = readSync('test/img/testTranslation.png');
    expect(transformed.data).toStrictEqual(expected.data);
  });
});
