import { formatReferenceForMlr, getChannelCoefficients } from '../correctColor';
import { referenceQpCard } from '../qpCardData';

describe('formatReferenceForMlr', () => {
  it('convert reference QP card', () => {
    const result = formatReferenceForMlr(referenceQpCard);
    expect(result).toMatchSnapshot();
    expect(result.r).toHaveLength(20);
    expect(result.g).toHaveLength(20);
    expect(result.b).toHaveLength(20);
  });
});
describe('getChannelCoefficients', () => {
  it('random data', () => {
    const inputData = [
      { r: 255, g: 0, b: 0 },
      { r: 255, g: 255, b: 0 },
      { r: 255, g: 0, b: 255 },
      { r: 0, g: 255, b: 255 },
      { r: 0, g: 255, b: 0 },
    ];
    const referenceData = {
      r: [200, 150, 100, 50, 0],
      g: [0, 20, 40, 60, 80],
      b: [0, 10, 20, 30, 40],
    };
    console.log(getChannelCoefficients(inputData, referenceData));
  });
});
