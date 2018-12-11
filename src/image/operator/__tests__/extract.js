import { Image, load, getHash } from 'test/common';
import binary from 'test/binary';

describe('we check we can extract a part of B/W image', function () {
  it('check the extract without specify position', async () => {
    let mask = new Image(2, 2, {
      kind: 'BINARY'
    });
    mask.setBitXY(0, 0);
    mask.setBitXY(1, 1);

    const image = await load('BW4x4.png');
    expect(function () {
      image.extract(mask);
    }).toThrow(/can not extract an image/);
  });

  it('check a binary image extract', function () {
    let image = new Image(8, 8,
      binary`
        00011000
        00011000
        00011000
        11111111
        11111111
        00011000
        00011000
        00011000
      `,
      { kind: 'BINARY' }
    );

    let mask = new Image(4, 4,
      binary`
        1111
        0000
        1111
        0000
      `, {
        kind: 'BINARY',
        parent: image,
        position: [2, 2]
      });

    let extract = image.extract(mask);
    expect(extract.bitDepth).toBe(1);
    expect(extract.height).toBe(4);
    expect(extract.width).toBe(4);
    expect(extract.data).toStrictEqual(binary`
      0110
      0000
      1111
      0000
    `);
  });


  it('check a rectangular binary image extract', function () {
    let image = new Image(8, 4,
      binary`
        00011000
        00011000
        00011000
        11111111
      `,
      { kind: 'BINARY' }
    );

    let mask = new Image(4, 2,
      binary`
        1111
        0000
      `, {
        kind: 'BINARY',
        parent: image,
        position: [3, 2]
      });

    let extract = image.extract(mask);
    expect(extract.bitDepth).toBe(1);
    expect(extract.height).toBe(2);
    expect(extract.width).toBe(4);
    expect(extract.data).toStrictEqual(binary`
      1100
      0000
    `);
  });

  it('check by specify 1,1 position with parent', async () => {
    const image = await load('BW4x4.png');
    let mask = new Image(2, 2, {
      kind: 'BINARY',
      position: [1, 1],
      parent: image
    });

    mask.setBitXY(0, 0);
    mask.setBitXY(1, 0);

    let extract = image.extract(mask);
    expect(getHash(image)).toBe(getHash(extract.parent));
    expect(extract.width).toBe(2);
    expect(extract.height).toBe(2);

    expect(Array.from(extract.data)).toStrictEqual([
      0, 255,
      255, 255,
      255, 0,
      0, 0
    ]);

    /* This corresponds to an extract if it was RGBA image */
    /*
          Array.from(extract.data).should.eql([
              0, 0, 0, 255,
              255, 255, 255, 255,
              255, 255, 255, 0,
              255, 255, 255, 0
          ]);
    */
  });
});
