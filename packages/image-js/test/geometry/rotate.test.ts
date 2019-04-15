import { rotate, readSync, BorderType } from 'ijs';
import { getTestImage } from 'test';

test('rotate + scale compared to opencv', () => {
  const expected = readSync('test/img/testRotate.png');
  const img = getTestImage();
  const rotated = rotate(img, 30, {
    scale: 0.8,
    borderType: BorderType.REFLECT,
    center: [2, 4]
  });

  expect(rotated.data).toStrictEqual(expected.data);
});

// test('dummy', () => {
//   const img = decodeImage('grayscale_by_zimmyrose.png');
//   const rotated = rotate(img, 125, {
//     scale: 1.5,
//     borderType: BorderType.CONSTANT,
//     fullImage: true
//   });

//   writeSync('rotated.png', rotated);
// });
