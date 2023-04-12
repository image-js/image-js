import { getDirection } from '..';

describe('cannyEdgeDetector', () => {
  it('5x5 grey image with dot', () => {
    const image = testUtils.createGreyImage([
      [0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0],
      [0, 0, 250, 0, 0],
      [0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0],
    ]);

    const expected = testUtils.createMask([
      [0, 0, 0, 0, 0],
      [0, 1, 1, 1, 0],
      [0, 1, 0, 1, 0],
      [0, 1, 1, 1, 0],
      [0, 0, 0, 0, 0],
    ]);

    let result = image.cannyEdgeDetector({
      lowThreshold: 0.08,
      highThreshold: 0.1,
      hysteresis: false,
      gaussianBlurOptions: { sigma: 1, size: 1 },
    });

    expect(result).toMatchMask(expected);
  });
  it('asymetrical image', () => {
    const image = testUtils.createGreyImage([
      [0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0],
      [0, 0, 250, 0, 0],
    ]);

    const expected = testUtils.createMask([
      [0, 0, 0, 0, 0],
      [0, 1, 1, 1, 0],
      [0, 0, 0, 0, 0],
    ]);

    let result = image.cannyEdgeDetector({
      lowThreshold: 0.08,
      highThreshold: 0.1,
      hysteresis: false,
      gaussianBlurOptions: { sigma: 1, size: 1 },
    });

    expect(result).toMatchMask(expected);
  });
  it('5x5 grey image with circle', () => {
    const image = testUtils.createGreyImage([
      [0, 0, 0, 0, 0],
      [0, 200, 200, 200, 0],
      [0, 200, 0, 200, 0],
      [0, 200, 200, 200, 0],
      [0, 0, 0, 0, 0],
    ]);

    const expected = testUtils.createMask([
      [0, 0, 0, 0, 0],
      [0, 1, 1, 1, 0],
      [0, 1, 0, 1, 0],
      [0, 1, 1, 1, 0],
      [0, 0, 0, 0, 0],
    ]);

    let result = image.cannyEdgeDetector({
      lowThreshold: 0.08,
      highThreshold: 0.1,
      hysteresis: false,
      gaussianBlurOptions: { sigma: 1, size: 1 },
    });

    expect(result).toMatchMask(expected);
  });

  it('5x5 grey image with filled circle', () => {
    const image = testUtils.createGreyImage([
      [0, 0, 0, 0, 0],
      [0, 200, 200, 200, 0],
      [0, 200, 200, 200, 0],
      [0, 200, 200, 200, 0],
      [0, 0, 0, 0, 0],
    ]);

    const expected = testUtils.createMask([
      [0, 0, 0, 0, 0],
      [0, 1, 1, 1, 0],
      [0, 1, 0, 1, 0],
      [0, 1, 1, 1, 0],
      [0, 0, 0, 0, 0],
    ]);

    let result = image.cannyEdgeDetector({
      lowThreshold: 0.08,
      highThreshold: 0.1,
      hysteresis: true,
      gaussianBlurOptions: { sigma: 1, size: 1 },
    });
    expect(result).toMatchMask(expected);
  });
  it('compare alphabet image to expected', () => {
    const image = testUtils.load('various/alphabet.jpg').convertColor('GREY');

    const expected = testUtils
      .load('morphology/alphabetCannyEdge.png')
      .threshold();

    const result = image.cannyEdgeDetector();
    expect(result).toMatchMask(expected);
  });
  it('compare grey image to expected', () => {
    const image = testUtils.load('various/grayscale_by_zimmyrose.png');

    const expected = testUtils
      .load('morphology/grayscaleCannyEdge.png')
      .threshold();
    expect(image.cannyEdgeDetector()).toMatchMask(expected);
  });
});

describe('getDirection', () => {
  it('horizontal, integer', () => {
    const x = 1;
    const y = 0;

    expect(getDirection(x, y)).toBe(0);
  });
  it('horizontal, float', () => {
    const x = 1.5;
    const y = 0.1;

    expect(getDirection(x, y)).toBe(0);
  });
  it('upward diagonal', () => {
    const x = 1;
    const y = 1;

    expect(getDirection(x, y)).toBe(1);
  });
  it('vertical, integer', () => {
    const x = 0;
    const y = 1;

    expect(getDirection(x, y)).toBe(2);
  });
  it('vertical, float', () => {
    const x = 0.1;
    const y = 1.2;

    expect(getDirection(x, y)).toBe(2);
  });
  it('downward diagonal', () => {
    const x = -1;
    const y = 1;

    expect(getDirection(x, y)).toBe(3);
  });
});
