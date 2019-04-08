import { blur, BorderType, read, write } from 'ijs';
import { getTestImage } from 'test';

describe('blur', () => {
  it('blur compared to opencv', async () => {
    const img = getTestImage();

    const blurred = blur(img, {
      width: 3,
      height: 5,
      borderType: BorderType.REFLECT
    });

    const expected = await read('test/img/testBlur.png');
    expect(blurred.data).toStrictEqual(expected.data);
  });
});
