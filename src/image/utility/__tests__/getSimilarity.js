import { Image } from 'test/common';

describe('calculate the overlap with another image', function () {
  it('check identical images without shift', function () {
    let image = new Image(1, 2, [0, 0, 0, 0, 255, 255, 255, 255]);
    let image2 = new Image(1, 2, [0, 0, 0, 0, 255, 255, 255, 255]);
    let similarity = image.getSimilarity(image2, { average: false });
    expect(similarity).toStrictEqual([1, 1, 1]);

    similarity = image.getSimilarity(image2, { average: true });
    expect(similarity).toBe(1);

    similarity = image.getSimilarity(image2);
    expect(similarity).toStrictEqual(1);

    similarity = image.getSimilarity(image2, {
      average: false,
      channels: ['r', 'g']
    });
    expect(similarity).toStrictEqual([1, 1]);

    similarity = image.getSimilarity(image2, {
      average: false,
      defaultAlpha: true
    });
    expect(similarity).toStrictEqual([1, 1, 1, 1]);
  });

  it('check if sum = 0', function () {
    let image = new Image(1, 2, [0, 255, 0, 0, 0, 0, 0, 0]);
    let image2 = new Image(1, 2, [0, 0, 200, 255, 255, 0, 255, 255]);

    let similarity = image.getSimilarity(image2, { average: false });
    expect(similarity).toStrictEqual([0, 0, 0]);

    similarity = image.getSimilarity(image2, {
      average: false,
      channels: ['r', 'g']
    });
    expect(similarity).toStrictEqual([0, 0]);

    similarity = image.getSimilarity(image2, {
      average: false,
      defaultAlpha: true
    });
    expect(similarity).toStrictEqual([0, 0, 0, 0]);
  });

  it('check different images without shift', function () {
    let image = new Image(1, 3, [0, 0, 0, 0, 20, 20, 20, 20, 30, 30, 30, 30]);
    let image2 = new Image(1, 3, [1, 10, 20, 2, 2, 20, 30, 1, 2, 20, 0, 2]);
    let similarity = image.getSimilarity(image2, { average: false });
    expect(similarity).toStrictEqual([0.08, 0.8, 0.4]);

    similarity = image.getSimilarity(image2, {
      average: false,
      normalize: true
    });
    expect(similarity).toStrictEqual([0.8, 0.8, 0.4]);

    similarity = image.getSimilarity(image2, {
      average: false,
      channels: ['r', 'b']
    });
    expect(similarity).toStrictEqual([0.08, 0.4]);

    similarity = image.getSimilarity(image2, { channels: ['r', 'b'] });
    expect(similarity).toBeCloseTo(0.24, 0.0002);

    similarity = image.getSimilarity(image2, {
      average: false,
      defaultAlpha: true
    });
    expect(similarity).toStrictEqual([0.08, 0.8, 0.4, 0.06]);
  });

  it('check different images with shift', function () {
    let image = new Image(3, 1, [0, 0, 0, 0, 10, 10, 10, 10, 30, 30, 30, 30]);
    let image2 = new Image(3, 1, [0, 0, 0, 0, 10, 10, 10, 10, 30, 30, 30, 30]);
    let similarity = image.getSimilarity(image2, { average: false });
    expect(similarity).toStrictEqual([1, 1, 1]);

    similarity = image.getSimilarity(image2, {
      average: false,
      normalize: true
    });
    expect(similarity).toStrictEqual([1, 1, 1]);

    similarity = image.getSimilarity(image2, {
      average: false,
      shift: [1, 0]
    });
    expect(similarity).toStrictEqual([0.25, 0.25, 0.25]);

    similarity = image.getSimilarity(image2, {
      average: false,
      shift: [-1, 0]
    });
    expect(similarity).toStrictEqual([0.25, 0.25, 0.25]);

    similarity = image.getSimilarity(image2, {
      average: false,
      shift: [0, 1]
    });
    expect(similarity).toStrictEqual([0, 0, 0]);

    similarity = image.getSimilarity(image2, {
      average: false,
      shift: [0, -1]
    });
    expect(similarity).toStrictEqual([0, 0, 0]);
  });

  it('check different images with size error', function () {
    let image = new Image(3, 1, [0, 0, 0, 0, 10, 10, 10, 10, 30, 30, 30, 30]);
    expect(function () {
      let image2 = new Image(3, 1, [0, 0], { kind: 'GREY' });
      image.getSimilarity(image2, { average: false });
    }).toThrow(/incorrect data size/);
  });

  it('check different images with other kind', function () {
    let image = new Image(3, 1, [0, 0, 0, 0, 10, 10, 10, 10, 30, 30, 30, 30]);
    let image2 = new Image(3, 1, [0, 0, 0], { kind: 'GREY' });
    expect(function () {
      image.getSimilarity(image2, { average: false });
    }).toThrow(/number of channel/);
  });

  it('check different images with other bitDepth', function () {
    let image = new Image(3, 1, [0, 0, 0, 0, 10, 10, 10, 10, 30, 30, 30, 30]);
    let image2 = new Image(3, 1, [0, 0, 0, 0, 10, 10, 10, 10, 30, 30, 30, 30], { bitDepth: 16 });
    expect(function () {
      image.getSimilarity(image2, { average: false });
    }).toThrow(/the same bitDepth/);
  });

  it('check different images with other color model', function () {
    let image = new Image(3, 1, [0, 0, 0, 0, 10, 10, 10, 10, 30, 30, 30, 30]);
    let image2 = new Image(3, 1, [0, 0, 0, 0, 10, 10, 10, 10, 30, 30, 30, 30], { colorModel: 'HSL' });
    expect(function () {
      image.getSimilarity(image2, { average: false });
    }).toThrow(/the same colorModel/);
  });
});
