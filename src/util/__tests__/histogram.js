import { mean as meanFromHistogram, median as medianFromHistogram } from '../histogram';

describe('we check histogram utilities', function () {
  it('should check meanFromHistogram', function () {
    expect(meanFromHistogram([10, 10, 10, 10])).toBe(1.5);
    expect(meanFromHistogram([0, 2, 2, 0, 4, 0])).toBe(2.75);
  });

  it('should check medianFromHistogram', function () {
    expect(medianFromHistogram([10, 10, 10, 10])).toBe(1.5);
    expect(medianFromHistogram([0, 2, 2, 0, 4, 0])).toBe(3);
  });

  it('should get the right value for medianFromHistogram with odd total', function () {
    expect(medianFromHistogram([0, 0, 3, 0, 0])).toBe(2);
    expect(medianFromHistogram([0, 1, 1, 1, 0])).toBe(2);
    expect(medianFromHistogram([1, 1, 1, 0, 0])).toBe(1);
    expect(medianFromHistogram([1, 0, 0, 0, 0])).toBe(0);
    expect(medianFromHistogram([0, 0, 0, 0, 1])).toBe(4);
    expect(medianFromHistogram([0, 0, 3, 0])).toBe(2);
    expect(medianFromHistogram([0, 1, 1, 1])).toBe(2);
    expect(medianFromHistogram([1, 1, 1, 0])).toBe(1);
    expect(medianFromHistogram([1, 0, 0, 0])).toBe(0);
    expect(medianFromHistogram([0, 0, 0, 1])).toBe(3);
  });

  it('should get the right value for medianFromHistogram with even total', function () {
    expect(medianFromHistogram([0, 0, 4, 0, 0])).toBe(2);
    expect(medianFromHistogram([0, 1, 2, 1, 0])).toBe(2);
    expect(medianFromHistogram([1, 2, 1, 0, 0])).toBe(1);
    expect(medianFromHistogram([0, 0, 0, 0, 4])).toBe(4);
    expect(medianFromHistogram([0, 0, 1, 1, 0])).toBe(2.5);
    expect(medianFromHistogram([4, 0, 0, 0, 0])).toBe(0);
    expect(() => medianFromHistogram([0, 0, 0, 0, 0])).toThrow(/unreachable/);
    expect(medianFromHistogram([1, 0, 0, 0, 1])).toBe(2);
  });
});
