import { Image, load } from 'test/common';

describe('Image loading', () => {
  it('should load from URL', function () {
    return load('format/png/rgba32.png').then(function (img) {
      expect(img.width).toBeGreaterThan(0);
      expect(img.height).toBeGreaterThan(0);
      expect(img.maxValue).toBe(255);
    });
  });

  it('should load from dataURL', function () {
    // a red dot
    const dataURL =
      'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAUAAAAFCAYAAACNbyblAAAAHElEQVQI12P4//8/w38GIAXDIBKE0DHxgljNBAAO9TXL0Y4OHwAAAABJRU5ErkJggg==';
    return Image.load(dataURL).then((img) => {
      expect(img.width).toBe(5);
      expect(img.height).toBe(5);
    });
  });
});
