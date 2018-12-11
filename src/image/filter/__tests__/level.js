import { Image, load, getHash } from 'test/common';

describe('level', function () {
  describe('extend the image to cover all levels', function () {
    it('should reach the borders and not touch alpha', function () {
      let image = new Image(1, 3, [0, 10, 255, 100, 0, 20, 255, 255, 0, 30, 255, 255]);
      let leveled = [0, 0, 255, 100, 0, 128, 255, 255, 0, 255, 255, 255];
      image.level();
      expect(image.data).toStrictEqual(leveled);
    });

    it('should just change red channel', function () {
      let image = new Image(1, 3, [0, 10, 255, 100, 0, 20, 255, 255, 0, 30, 255, 255]);
      let leveled = [0, 10, 255, 100, 0, 20, 255, 255, 0, 30, 255, 255];
      image.level({ channels: [0] });
      expect(image.data).toStrictEqual(leveled);
    });

    it('should change only red and green channe', function () {
      let image = new Image(1, 3, [0, 10, 255, 100, 0, 20, 255, 255, 0, 30, 255, 255]);
      let leveled = [0, 0, 255, 100, 0, 128, 255, 255, 0, 255, 255, 255];
      image.level({ channels: ['r', 'g'] });
      expect(image.data).toStrictEqual(leveled);
    });

    it('should not change if it used the full range', function () {
      let image = new Image(1, 3, [0, 0, 0, 255, 100, 110, 120, 255, 255, 255, 255, 255]);
      let leveled = [0, 0, 0, 255, 100, 110, 120, 255, 255, 255, 255, 255];
      image.level();
      expect(image.data).toStrictEqual(leveled);
    });

    it('should not change at all an image that has the extreme colors', async () => {
      const image = await load('rgb24bits.png');
      let hash = getHash(image);
      image.level();
      let hash2 = getHash(image);
      expect(hash).toBe(hash2);
    });

    it('should change for a normal picture', async () => {
      const image = await load('cat-small.png');
      let hash = getHash(image);
      image.level();
      let hash2 = getHash(image);
      expect(hash).not.toBe(hash2);
    });
  });

  describe('testing various file format', function () {
    const tests = ['grey8', 'greya16', 'greya32', 'rgb24', 'rgb48', 'rgba32', 'rgba64'];
    it.each(tests)('should not change: format/png/%s', async (test) => {
      const image = await load(`format/png/${test}.png`);
      let hash = getHash(image);
      image.level();
      let hash2 = getHash(image);
      expect(hash).toBe(hash2);
    });
  });

  describe('extend the image to specific levels', function () {
    it('should expand from 100-110 not touch alpha', function () {
      let image = new Image(1, 3, [
        0, 100, 50, 100,
        100, 105, 105, 255,
        110, 110, 150, 255
      ]);
      let leveled = [
        0, 0, 0, 100,
        0, 128, 128, 255,
        255, 255, 255, 255
      ];
      image.level({
        algorithm: 'range',
        min: 100,
        max: 110
      });

      expect(image.data).toStrictEqual(leveled);
    });
  });
});

