import { rotate } from '..';
import { BorderType } from '../../utils/interpolateBorder';
import { InterpolationType } from '../../utils/interpolatePixel';

test('rotate + scale compared to opencv (nearest)', () => {
  const img = testUtils.load('opencv/test.png');
  const rotated = rotate(img, 30, {
    scale: 0.8,
    borderType: BorderType.REFLECT,
    interpolationType: InterpolationType.NEAREST,
    center: [2, 4],
  });

  expect(rotated).toMatchImage('opencv/testRotate.png');
});

test.skip('rotate + scale compared to opencv (bilinear)', () => {
  const img = testUtils.load('opencv/test.png');

  const rotated = rotate(img, 30, {
    scale: 1.4,
    borderType: BorderType.REFLECT,
    interpolationType: InterpolationType.BILINEAR,
    center: [2, 4],
  });

  expect(rotated).toMatchImage('opencv/testRotateBilinear.png');
});

test.skip('rotate + scale compared to opencv (bicubic)', () => {
  const img = testUtils.load('opencv/test.png');

  const rotated = rotate(img, 30, {
    scale: 1.4,
    borderType: BorderType.REFLECT,
    interpolationType: InterpolationType.BICUBIC,
    center: [2, 4],
  });

  expect(rotated).toMatchImage('opencv/testRotateBicubic.png');
});
