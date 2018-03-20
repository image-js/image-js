import { Image, Stack, getSquare, getImage } from 'test/common';

describe('Core methods of Stack objects', function () {
  let stack = new Stack([getSquare(), getSquare()]);

  it('Stack.load', function () {
    return Stack.load([getImage('BW2x2.png'), getImage('BW3x3.png')]).then(function (images) {
      expect(images).toHaveLength(2);
      expect(images).toBeInstanceOf(Stack);
      expect(images[0]).toBeInstanceOf(Image);
      expect(images[1]).toBeInstanceOf(Image);
      expect(images[0].width).toBe(2);
      expect(images[1].width).toBe(3);
    });
  });

  it('Stack.load with error', function () {
    return Stack.load([getImage('BW2x2.png'), getImage('inexistant')]).catch(function (e) {
      expect(e.code).toBe('ENOENT');
      return 42;
    }).then(function (value) {
      expect(value).toBe(42);
    });
  });

  it('should be an Array', function () {
    expect(stack).toBeInstanceOf(Stack);
    expect(stack).toBeInstanceOf(Array);
    expect(Array.isArray(stack)).toBe(true);
  });

  it('should have Array methods on prototype', function () {
    stack.forEach(function (image) {
      expect(image).toBeInstanceOf(Image);
    });
    expect(stack.filter(() => false)).toHaveLength(0);
  });

  it('map should return a Stack', function () {
    let result = stack.map(function (image) {
      return image.grey();
    });

    expect(result).toBeInstanceOf(Stack);
    expect(result).toHaveLength(2);
    expect(result[0].components).toBe(1);

    expect(function () {
      stack.map();
    }).toThrowError(TypeError);
  });
});
