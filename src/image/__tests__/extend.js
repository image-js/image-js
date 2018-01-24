import { Image, getSquare } from 'test/common';

function sub(a = 1, b = 2) {
  return a - b;
}

describe('Image extensions', function () {
  Image.extendMethod('testMethod1', sub);
  Image.extendMethod('testMethod2', function () {
    return this.width;
  }, { inPlace: true, returnThis: false });
  Image.extendMethod('testMethod3', function () {
    this.clone();
  }, { inPlace: true });
  Image.extendMethod('testMethod4', sub, { partialArgs: [6] });
  describe('extendMethod', function () {
    let img = getSquare();
    it('should add methods to the prototype', function () {
      expect(typeof img.testMethod1).toBe('function');
      expect(typeof img.testMethod2).toBe('function');
      expect(Image.prototype.testMethod1).toBe(img.testMethod1);
    });
    it('inplace and returnThis options', function () {
      expect(img.testMethod1()).toBe(-1);
      expect(img.testMethod1(5)).toBe(3);
      expect(img.testMethod2()).toBe(3);
      expect(img.testMethod3()).toBe(img);
    });
    it('partial arguments', function () {
      expect(img.testMethod4()).toBe(4);
      expect(img.testMethod4(3)).toBe(3);
    });
  });

  let count = 0;
  Image.extendProperty('testProp1', function () {
    count++;
    return this.width;
  });
  Image.extendProperty('testProp2', sub, { partialArgs: [5] });
  Image.extendProperty('testProp3', sub, { partialArgs: [18, 3] });
  describe('extendProperty', function () {
    let img;
    beforeEach(function () {
      count = 0;
      img = getSquare();
    });
    it('should compute the property on first access', function () {
      expect(img.testProp1).toBe(3);
      expect(count).toBe(1);
      expect(img.testProp1).toBe(3);
      expect(img.testProp1).toBe(3);
      expect(count).toBe(1);
    });
    it('should reset after an inplace filter', function () {
      expect(img.testProp1).toBe(3);
      expect(count).toBe(1);
      expect(img.testProp1).toBe(3);
      expect(count).toBe(1);
      img.testMethod3();
      expect(count).toBe(1);
      expect(img.testProp1).toBe(3);
      expect(count).toBe(2);
    });
    it('should pass parameters', function () {
      expect(img.testProp2).toBe(3);
      expect(img.testProp3).toBe(15);
    });
  });
});
