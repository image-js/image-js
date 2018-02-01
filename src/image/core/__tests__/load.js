import { Image, load } from 'test/common';

import { createCanvas } from 'canvas';

describe('Image core', () => {
  it('constructor defaults', () => {
    let img = new Image();
    expect(img.width).toBe(1);
    expect(img.height).toBe(1);
    expect(img.data).toHaveLength(4);
  });

  it('invalid constructor use', () => {
    expect(function () {
      new Image(0, 0); // eslint-disable-line no-new
    }).toThrowError(/width must be greater than 0/);
    expect(function () {
      new Image(5, 0); // eslint-disable-line no-new
    }).toThrowError(/height must be greater than 0/);
    expect(function () {
      new Image(10, 10, { kind: 'BLABLA' }); // eslint-disable-line no-new
    }).toThrowError(/invalid image kind: BLABLA/);
  });

  it('construct with a kind', () => {
    const img = new Image(1, 1, { kind: 'RGB' });
    expect(img.data).toHaveLength(3);
  });

  it('construct a 32bit image', () => {
    const img = new Image(1, 1, { bitDepth: 32 });
    expect(img.bitDepth).toBe(32);
    expect(img.data).toBeInstanceOf(Float32Array);
    expect(img.maxValue).toBe(Number.MAX_VALUE);
  });

  it('wrong array passed to setData', () => {
    const img = new Image(1, 1);
    expect(() => {
      img.setData([1]);
    }).toThrow(/incorrect data size. Should be 4 and found 1/);
  });

  it('create from Canvas', () => {
    let canvas = createCanvas(2, 2);
    let ctx = canvas.getContext('2d');
    ctx.fillStyle = 'red';
    ctx.fillRect(0, 0, 2, 1);
    let img = Image.fromCanvas(canvas);
    expect(Array.from(img.data)).toEqual([
      255,   0,   0, 255, 255,   0,   0, 255,
      0,   0,   0,   0,   0,   0,   0,   0
    ]);
  });

  it('should load from URL', function () {
    return load('format/rgba32.png').then(function (img) {
      expect(img.width).toBeGreaterThan(0);
      expect(img.height).toBeGreaterThan(0);
      expect(img.maxValue).toBe(255);
    });
  });

  it('should load from dataURL', function () {
    // a red dot
    const dataURL = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAUAAAAFCAYAAACNbyblAAAAHElEQVQI12P4//8/w38GIAXDIBKE0DHxgljNBAAO9TXL0Y4OHwAAAABJRU5ErkJggg==';
    return Image.load(dataURL).then((img) => {
      expect(img.width).toBe(5);
      expect(img.height).toBe(5);
    });
  });

  it('should clone', async () => {
    const img = await load('format/rgba32.png');
    const clone = img.clone();
    expect(clone).toBeInstanceOf(Image);
    expect(clone).not.toBe(img);
    expect(clone.data).not.toBe(img.data);
    expect(clone.toDataURL()).toBe(img.toDataURL());
  });

  it('should clone and keep same data', async () => {
    const img = await load('format/rgba32.png');
    const clone = img.clone({ copyData: false });
    expect(clone).toBeInstanceOf(Image);
    expect(clone).not.toBe(img);
    expect(clone.data).toBe(img.data);
    expect(clone.toDataURL()).toBe(img.toDataURL());
  });
});
