import { getFactor, factorDimensions } from '../converter';

describe('Converter tests', function () {
  describe('getFactor', function () {
    it('with numbers', function () {
      expect(getFactor(1)).toBe(1);
      expect(getFactor(0.6)).toBe(0.6);
      expect(getFactor(5)).toBe(5);
    });

    it('with number strings', function () {
      expect(getFactor('1')).toBe(1);
      expect(getFactor('0.6')).toBe(0.6);
      expect(getFactor('5')).toBe(5);
    });

    it('with percentage strings', function () {
      expect(getFactor('100%')).toBe(1);
      expect(getFactor('15%')).toBe(0.15);
      expect(getFactor('256%')).toBe(2.56);
    });
  });

  describe('factorDimensions', function () {
    it('integer result', function () {
      expect(factorDimensions(1, 100, 100)).toStrictEqual({ width: 100, height: 100 });
      expect(factorDimensions(2, 100, 30)).toStrictEqual({ width: 200, height: 60 });
      expect(factorDimensions(0.5, 12, 100)).toStrictEqual({ width: 6, height: 50 });
    });
    it('non integer result', function () {
      expect(factorDimensions(0.5, 11, 13)).toStrictEqual({ width: 6, height: 7 });
      expect(factorDimensions('25%', 15, 25)).toStrictEqual({ width: 4, height: 6 });
      expect(factorDimensions(1 / 3, 100, 122)).toStrictEqual({ width: 33, height: 41 });
    });
  });
});
