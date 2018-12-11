import { Image, Stack, getSquare, getImage } from 'test/common';

describe('Core methods of Stack objects', function () {
  let stack = new Stack([getSquare(), getSquare()]);

  it('Stack.load', async () => {
    const images = await Stack.load([getImage('BW2x2.png'), getImage('BW3x3.png')]);
    expect(images).toHaveLength(2);
    expect(images).toBeInstanceOf(Stack);
    expect(images[0]).toBeInstanceOf(Image);
    expect(images[1]).toBeInstanceOf(Image);
    expect(images[0].width).toBe(2);
    expect(images[1].width).toBe(3);
  });

  it('Stack.load with error', async () => {
    await expect(Stack.load([getImage('BW2x2.png'), getImage('inexistant')])).rejects.toThrow(/ENOENT/);
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
    }).toThrow(TypeError);
  });
});
