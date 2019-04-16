import { rotate, readSync, BorderType, InterpolationType } from 'ijs';
import { getTestImage } from 'test';

test('rotate + scale compared to opencv (nearest)', () => {
  const expected = readSync('test/img/testRotate.png');
  const img = getTestImage();
  const rotated = rotate(img, 30, {
    scale: 0.8,
    borderType: BorderType.REFLECT,
    interpolationType: InterpolationType.NEAREST,
    center: [2, 4]
  });

  expect(rotated.data).toStrictEqual(expected.data);
});

// test('rotate + scale compared to opencv (bilinear)', () => {
//   const expected = readSync('test/img/testRotateBilinear.png');
//   const img = getTestImage();
//   const rotated = rotate(img, 30, {
//     scale: 1.4,
//     borderType: BorderType.REFLECT,
//     interpolationType: InterpolationType.BILINEAR,
//     center: [2, 4]
//   });

//   expect(rotated.data).toStrictEqual(expected.data);
// });

// test('rotate + scale compared to opencv (bicubic)', () => {
//   const expected = readSync('test/img/testRotateBicubic.png');
//   const img = getTestImage();
//   const rotated = rotate(img, 30, {
//     scale: 1.4,
//     borderType: BorderType.REFLECT,
//     interpolationType: InterpolationType.BICUBIC,
//     center: [2, 4]
//   });

//   expect(rotated.data).toStrictEqual(expected.data);
// });
