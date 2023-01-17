import { getBasicMontage } from '../getBasicMontage';

test('check montage is correct', () => {
  const image1 = testUtils.load('featureMatching/alphabet.jpg');
  const image2 = testUtils.load('featureMatching/alphabetRotated-10.jpg');

  expect(getBasicMontage(image1, image2)).toMatchImageSnapshot();
});
