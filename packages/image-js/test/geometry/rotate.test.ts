import {
  rotate,
  readSync,
  BorderType,
  InterpolationType
  // writeSync,
  // InterpolationType
} from 'ijs';
import {
  getTestImage
  // decodeImage
} from 'test';

test('rotate + scale compared to opencv', () => {
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

// test('dummy', () => {
//   const img = decodeImage('grayscale_by_zimmyrose.png');
//   const rotated = rotate(img, 45, {
//     scale: 1.5,
//     borderType: BorderType.CONSTANT,
//     fullImage: true,
//     interpolationType: InterpolationType.BILINEAR,
//     borderValue: 255
//   });

//   writeSync('rotated.png', rotated);
// });
