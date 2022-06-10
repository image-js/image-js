import { BorderType } from '../../utils/interpolateBorder';

describe('blur', () => {
  it('blur compared to opencv', async () => {
    const img = testUtils.load('opencv/test.png');

    const blurred = img.blur({
      width: 3,
      height: 5,
      borderType: BorderType.REFLECT,
    });

    const expected = testUtils.load('opencv/testBlur.png');
    expect(blurred).toMatchImage(expected);
  });
});
