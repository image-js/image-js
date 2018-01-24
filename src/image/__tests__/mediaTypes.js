import { getType, canWrite } from '../mediaTypes';
import { Image } from 'test/common';

describe('Media Type support checks', function () {

  it('getType', function () {
    expect(getType('png')).toBe('image/png');
    expect(getType('image/png')).toBe('image/png');
  });

  it('direct calls', function () {
    expect(canWrite('image/png')).toBe(true);
    expect(canWrite('image/jpeg')).toBe(false);
    expect(canWrite('image/abc')).toBe(false);
  });

  it('static method', function () {
    expect(Image.isTypeSupported('png')).toBe(true);
    expect(Image.isTypeSupported('image/png')).toBe(true);
    expect(Image.isTypeSupported('image/jpeg')).toBe(false);
    expect(Image.isTypeSupported('abc')).toBe(false);
  });

  it('static method - bad arguments', function () {
    expect(function () {
      Image.isTypeSupported('', 'other');
    }).toThrowError(/unknown operation/);
    expect(function () {
      Image.isTypeSupported(123);
    }).toThrowError(TypeError);
  });

});
