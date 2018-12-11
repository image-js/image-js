import { Image } from 'test/common';

describe('resize', function () {
  describe('using a factor', function () {
    it('up - even dimensions', function () {
      const image = new Image(10, 12);
      const result = image.resize({ factor: 2 });
      expect(result.width).toBe(20);
      expect(result.height).toBe(24);
    });

    it('down - even dimensions', function () {
      const image = new Image(10, 12);
      const result = image.resize({ factor: 0.5 });
      expect(result.width).toBe(5);
      expect(result.height).toBe(6);
    });

    it('up - decimal factor', function () {
      const image = new Image(9, 13);
      const result = image.resize({ factor: 1.5 });
      expect(result.width).toBe(14);
      expect(result.height).toBe(20);
    });

    it('down - odd dimensions', function () {
      const image = new Image(9, 13);
      const result = image.resize({ factor: 1 / 3 });
      expect(result.width).toBe(3);
      expect(result.height).toBe(4);
    });
  });
  describe('binary images using a factor', function () {
    it('up - 2 factor', function () {
      let binary = new Image(2, 2, [144], {
        kind: 'BINARY'
      });
      let newImage = binary.resize({ factor: 2 });
      expect(newImage.width).toBe(4);
      expect(newImage.height).toBe(4);
      expect(Array.from(newImage.data)).toStrictEqual([204, 51]);
    });
    it('up - 1.5 factor', function () {
      let binary = new Image(2, 2, [144], {
        kind: 'BINARY'
      });
      let newImage = binary.resize({ factor: 1.5 });
      expect(newImage.width).toBe(3);
      expect(newImage.height).toBe(3);
      expect(Array.from(newImage.data)).toStrictEqual([141, 128]);
    });
    it('down - 0.5 factor', function () {
      let binary = new Image(4, 4, [204, 51], {
        kind: 'BINARY'
      });
      let newImage = binary.resize({ factor: 0.5 });
      expect(newImage.width).toBe(2);
      expect(newImage.height).toBe(2);
      expect(Array.from(newImage.data)).toStrictEqual([144]);
      expect(newImage.position).toStrictEqual([1, 1]);
    });

    it('down - 0.01 factor', function () {
      let binary = new Image(4, 4, [204, 51], {
        kind: 'BINARY'
      });
      let newImage = binary.resize({ factor: 0.01 });
      expect(newImage.width).toBe(1);
      expect(newImage.height).toBe(1);
      expect(Array.from(newImage.data)).toStrictEqual([128]);
      expect(newImage.position).toStrictEqual([2, 2]);
    });
  });

  describe('with preserveAspectRatio', function () {
    it('up - auto height', function () {
      const image = new Image(10, 12);
      const result = image.resize({ width: 20 });
      expect(result.width).toBe(20);
      expect(result.height).toBe(24);
    });

    it('up - auto width', function () {
      const image = new Image(10, 12);
      const result = image.resize({ height: 20 });
      expect(result.width).toBe(17);
      expect(result.height).toBe(20);
    });

    it('down - auto height', function () {
      const image = new Image(10, 12);
      const result = image.resize({ width: 5 });
      expect(result.width).toBe(5);
      expect(result.height).toBe(6);
    });

    it('down - auto width', function () {
      const image = new Image(10, 12);
      const result = image.resize({ height: 5 });
      expect(result.width).toBe(4);
      expect(result.height).toBe(5);
    });
  });
  describe('binary images with preserveAspectRatio', function () {
    it('up - auto width', function () {
      let binary = new Image(2, 2, [144], {
        kind: 'BINARY'
      });
      let newImage = binary.resize({ height: 4 });
      expect(newImage.width).toBe(4);
      expect(newImage.height).toBe(4);
      expect(Array.from(newImage.data)).toStrictEqual([204, 51]);
    });
    it('up - auto height', function () {
      let binary = new Image(2, 2, [144], {
        kind: 'BINARY'
      });
      let newImage = binary.resize({ width: 3 });
      expect(newImage.width).toBe(3);
      expect(newImage.height).toBe(3);
      expect(Array.from(newImage.data)).toStrictEqual([141, 128]);
    });
    it('down - auto width', function () {
      let binary = new Image(4, 4, [204, 51], {
        kind: 'BINARY'
      });
      let newImage = binary.resize({ height: 2 });
      expect(newImage.width).toBe(2);
      expect(newImage.height).toBe(2);
      expect(Array.from(newImage.data)).toStrictEqual([144]);
    });

    it('down - auto height', function () {
      let binary = new Image(4, 4, [204, 51], {
        kind: 'BINARY'
      });
      let newImage = binary.resize({ width: 1 });
      expect(newImage.width).toBe(1);
      expect(newImage.height).toBe(1);
      expect(Array.from(newImage.data)).toStrictEqual([128]);
    });
  });

  describe('without preserveAspectRatio', function () {
    it('up - with width', function () {
      const image = new Image(10, 12);
      const result = image.resize({ width: 20, preserveAspectRatio: false });
      expect(result.width).toBe(20);
      expect(result.height).toBe(12);
    });

    it('up - with height', function () {
      const image = new Image(10, 12);
      const result = image.resize({ height: 20, preserveAspectRatio: false });
      expect(result.width).toBe(10);
      expect(result.height).toBe(20);
    });

    it('down - with width', function () {
      const image = new Image(10, 12);
      const result = image.resize({ width: 5, preserveAspectRatio: false });
      expect(result.width).toBe(5);
      expect(result.height).toBe(12);
    });

    it('down - with height', function () {
      const image = new Image(10, 12);
      const result = image.resize({ height: 5, preserveAspectRatio: false });
      expect(result.width).toBe(10);
      expect(result.height).toBe(5);
    });

    it('with up factor', function () {
      const image = new Image(10, 12);
      const result = image.resize({ factor: 2, height: 5, preserveAspectRatio: false });
      expect(result.width).toBe(20);
      expect(result.height).toBe(10);
    });

    it('with down factor', function () {
      const image = new Image(10, 12);
      const result = image.resize({ factor: 0.5, height: 5, preserveAspectRatio: false });
      expect(result.width).toBe(5);
      expect(result.height).toBe(3);
    });
  });

  describe('binary images without preserveAspectRatio', function () {
    it('up - with height', function () {
      let binary = new Image(2, 2, [144], {
        kind: 'BINARY'
      });
      let newImage = binary.resize({ height: 4, preserveAspectRatio: false });
      expect(newImage.width).toBe(2);
      expect(newImage.height).toBe(4);
    });
    it('up - with width', function () {
      let binary = new Image(2, 2, [144], {
        kind: 'BINARY'
      });
      let newImage = binary.resize({ width: 3, preserveAspectRatio: false });
      expect(newImage.width).toBe(3);
      expect(newImage.height).toBe(2);
    });
    it('down - with height', function () {
      let binary = new Image(4, 4, [204, 51], {
        kind: 'BINARY'
      });
      let newImage = binary.resize({ height: 2, preserveAspectRatio: false });
      expect(newImage.width).toBe(4);
      expect(newImage.height).toBe(2);
    });
    it('down - with width', function () {
      let binary = new Image(4, 4, [204, 51], {
        kind: 'BINARY'
      });
      let newImage = binary.resize({ width: 1, preserveAspectRatio: false });
      expect(newImage.width).toBe(1);
      expect(newImage.height).toBe(4);
    });
  });
});
