import { getBasicMontage } from '../getBasicMontage';

const image1 = testUtils.load('featureMatching/alphabet.jpg');
const image2 = testUtils.load('featureMatching/alphabetRotated-10.jpg');

test('check montage is correct', () => {
  expect(getBasicMontage(image1, image2, 1)).toMatchImageSnapshot();
});

test('scale = 2', () => {
  const result = getBasicMontage(image1, image2, 2);
  expect(result.height).toBe(2 * image2.height);
});
