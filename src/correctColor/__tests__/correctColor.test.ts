import { readSync } from '../../load';
import { writeSync } from '../../save';
import {
  arraysToRgbColors,
  correctColor,
  formatReferenceForMlr,
} from '../correctColor';
import { polishImageData } from '../imageColors';
import { referenceQpCard } from '../referenceQpCard';

describe('formatReferenceForMlr', () => {
  it('convert reference QP card', () => {
    const result = formatReferenceForMlr(referenceQpCard);
    expect(result).toMatchSnapshot();
    expect(result.r).toHaveLength(20);
    expect(result.g).toHaveLength(20);
    expect(result.b).toHaveLength(20);
  });
});

describe('correctColor', () => {
  it('small test image', () => {
    const image = testUtils.load('opencv/test.png');

    const inputData = arraysToRgbColors(polishImageData.colors);

    const result = correctColor(image, inputData, referenceQpCard);

    writeSync('src/correctColor/__tests__/correctColor-test.png', result);
  });

  it('polish scan data', () => {
    const image = readSync('src/correctColor/__tests__/pol_example.png');

    const inputData = arraysToRgbColors(polishImageData.colors);

    const result = correctColor(image, inputData, referenceQpCard);

    writeSync('src/correctColor/__tests__/correctColor.png', result);
  });
});
