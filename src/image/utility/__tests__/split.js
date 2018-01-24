import { Image } from 'test/common';

describe('split an image of 3 components and keep alpha', function () {
  let image = new Image(1, 2, [230, 83, 120, 255, 100, 140, 13, 240]);
  let images = image.split();

  it('should yield 3 grey images with alpha', function () {
    expect(images).toBeInstanceOf(Array);
    expect(images).toHaveLength(3);
    expect(images[0].components).toBe(1);
    expect(images[0].channels).toBe(2);
  });

  it('check values of the 3 images', function () {
    expect(images[0].data[0]).toBe(230);
    expect(images[0].data[1]).toBe(255);
    expect(images[0].data[2]).toBe(100);
    expect(images[0].data[3]).toBe(240);
    expect(images[1].data[0]).toBe(83);
    expect(images[1].data[1]).toBe(255);
    expect(images[1].data[2]).toBe(140);
    expect(images[1].data[3]).toBe(240);
    expect(images[2].data[0]).toBe(120);
    expect(images[2].data[1]).toBe(255);
    expect(images[2].data[2]).toBe(13);
    expect(images[2].data[3]).toBe(240);
  });
});

describe('split an image of 3 components and have alpha separately', function () {
  let image = new Image(1, 2, [230, 83, 120, 255, 100, 140, 13, 240]);
  let images = image.split({ preserveAlpha: false });

  it('should yield 4 grey images with alpha', function () {
    expect(images).toBeInstanceOf(Array);
    expect(images).toHaveLength(4);
    expect(images[0].components).toBe(1);
    expect(images[0].channels).toBe(1);
  });

  it('check values of the 4 images', function () {
    expect(images[0].data[0]).toBe(230);
    expect(images[0].data[1]).toBe(100);
    expect(images[1].data[0]).toBe(83);
    expect(images[1].data[1]).toBe(140);
    expect(images[2].data[0]).toBe(120);
    expect(images[2].data[1]).toBe(13);
    expect(images[3].data[0]).toBe(255);
    expect(images[3].data[1]).toBe(240);
  });
});
