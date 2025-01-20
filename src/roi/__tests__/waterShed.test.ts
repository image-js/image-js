import { computeThreshold } from '../../operations/index.js';
import { waterShed } from '../waterShed.js';

describe('Test WaterShed Roi generation', () => {
  it('test 1,basic test without parameters/options', () => {
    const image = testUtils.createGreyImage([
      [3, 3, 3, 3, 3],
      [3, 2, 2, 2, 3],
      [3, 2, 1, 2, 3],
      [3, 2, 2, 2, 3],
      [3, 3, 3, 3, 3],
    ]);
    const roiMapManager = waterShed(image, {});
    const resultArray = testUtils.getInt32Array(`
      -1, -1, -1, -1, -1,
      -1, -1, -1, -1, -1,
      -1, -1, -1, -1, -1,
      -1, -1, -1, -1, -1,
      -1, -1, -1, -1, -1,`);
    expect(roiMapManager).toEqual({
      map: {
        data: resultArray,
        nbPositive: 0,
        nbNegative: 1,
        width: 5,
        height: 5,
      },
      whiteRois: [],
      blackRois: [],
    });
  });

  it('test 2, waterShed for a grey image', () => {
    const image = testUtils.createGreyImage([
      [3, 3, 3, 3, 3, 3, 3, 3, 4, 4],
      [3, 3, 2, 2, 2, 3, 3, 3, 4, 4],
      [4, 3, 2, 1, 2, 2, 3, 3, 4, 4],
      [4, 3, 2, 2, 2, 2, 3, 3, 3, 4],
      [4, 4, 4, 3, 2, 3, 2, 3, 3, 4],
      [4, 4, 4, 3, 3, 3, 3, 1, 3, 3],
      [4, 3, 3, 3, 3, 3, 2, 2, 2, 3],
      [4, 4, 3, 3, 3, 3, 2, 2, 2, 2],
      [4, 4, 4, 4, 3, 2, 2, 2, 2, 3],
      [4, 4, 4, 4, 3, 3, 3, 3, 2, 3],
    ]);

    const roiMapManager = waterShed(image, { threshold: 2 / 255 });
    const resultArray = testUtils.getInt32Array(`
         0,  0,  0,  0,  0,  0,  0,  0,  0,  0, 
         0,  0, -1, -1, -1,  0,  0,  0,  0,  0,
         0,  0, -1, -1, -1, -1,  0,  0,  0,  0, 
         0,  0, -1, -1, -1, -1,  0,  0,  0,  0,
         0,  0,  0,  0, -1,  0,  0,  0,  0,  0,
         0,  0,  0,  0,  0,  0,  0, -2,  0,  0,
         0,  0,  0,  0,  0,  0, -2, -2, -2,  0,
         0,  0,  0,  0,  0,  0, -2, -2, -2, -2,
         0,  0,  0,  0,  0, -2, -2, -2, -2,  0,  
         0,  0,  0,  0,  0,  0,  0,  0, -2,  0`);
    expect(roiMapManager).toEqual({
      map: {
        data: resultArray,
        nbPositive: 0,
        nbNegative: 2,
        width: 10,
        height: 10,
      },
      whiteRois: [],
      blackRois: [],
    });
  });

  it('test 3, with threshold option', () => {
    const image = testUtils.createGreyImage([
      [1, 1, 1, 1, 1],
      [1, 2, 2, 2, 1],
      [1, 2, 3, 2, 1],
      [1, 2, 2, 2, 1],
      [1, 1, 1, 1, 1],
    ]);
    const invertedImage = image.invert();
    const roiMapManager = waterShed(invertedImage, {
      threshold: 253 / image.maxValue,
    });
    const resultArray = testUtils.getInt32Array(`
      0, 0, 0, 0, 0,
      0,-1,-1,-1, 0, 
      0,-1,-1,-1, 0, 
      0,-1,-1,-1, 0,
      0, 0, 0, 0, 0,
    `);
    expect(roiMapManager).toEqual({
      map: {
        data: resultArray,
        nbPositive: 0,
        nbNegative: 1,
        width: 5,
        height: 5,
      },
      whiteRois: [],
      blackRois: [],
    });
  });
  it('test 4, waterShed through threshold value', () => {
    const image = testUtils.createGreyImage([
      [3, 3, 3, 3, 3, 3, 3, 3, 4, 4],
      [3, 3, 2, 2, 2, 3, 3, 3, 4, 4],
      [4, 3, 2, 1, 2, 2, 3, 3, 4, 4],
      [4, 3, 2, 2, 2, 2, 3, 3, 3, 4],
      [4, 4, 4, 3, 2, 3, 3, 3, 3, 4],
      [4, 4, 4, 3, 3, 3, 3, 3, 3, 3],
      [4, 3, 3, 3, 3, 3, 2, 2, 2, 3],
      [4, 4, 3, 3, 3, 3, 2, 1, 2, 2],
      [4, 4, 4, 4, 3, 2, 2, 2, 2, 3],
      [4, 4, 4, 4, 3, 3, 3, 3, 2, 3],
    ]);
    const threshold = computeThreshold(image, { algorithm: 'otsu' });

    const roiMapManager = waterShed(image, {
      threshold: threshold / image.maxValue,
    });
    const resultArray = testUtils.getInt32Array(`
    0,  0,  0,  0,  0,  0,  0,  0,  0,  0,
    0,  0, -1, -1, -1,  0,  0,  0,  0,  0,
    0,  0, -1, -1, -1, -1,  0,  0,  0,  0,
    0,  0, -1, -1, -1, -1   0,  0,  0,  0,
    0,  0,  0,  0, -1,  0,  0,  0,  0,  0,
    0,  0,  0,  0,  0,  0,  0,  0,  0,  0,
    0,  0,  0,  0,  0,  0, -2, -2, -2,  0,  
    0,  0,  0,  0,  0,  0, -2, -2, -2, -2,
    0,  0,  0,  0,  0, -2, -2, -2, -2,  0,
    0,  0,  0,  0,  0,  0,  0,  0, -2,  0
    `);
    expect(roiMapManager).toEqual({
      map: {
        data: resultArray,
        nbPositive: 0,
        nbNegative: 2,
        width: 10,
        height: 10,
      },
      whiteRois: [],
      blackRois: [],
    });
  });
  it('test 5, waterShed through threshold mask and with inverted image', () => {
    const image = testUtils.createGreyImage([
      [3, 3, 3, 3, 3, 3, 3, 3, 4, 4],
      [3, 3, 2, 2, 2, 3, 3, 8, 4, 4],
      [4, 3, 2, 1, 2, 2, 3, 3, 4, 4],
      [4, 3, 2, 2, 6, 2, 3, 3, 3, 4],
      [4, 4, 4, 3, 2, 3, 3, 3, 3, 4],
      [4, 4, 4, 3, 3, 3, 3, 3, 3, 3],
      [4, 3, 3, 3, 3, 6, 2, 2, 2, 3],
      [4, 4, 3, 3, 3, 3, 2, 1, 2, 2],
      [4, 4, 4, 4, 3, 2, 2, 2, 2, 3],
      [4, 4, 4, 4, 3, 3, 3, 3, 9, 3],
    ]);

    const mask = image.threshold({ algorithm: 'otsu' });
    const roiMapManager = waterShed(image, { mask });
    const resultArray = testUtils.getInt32Array(`
    -1, -1, -1, -1, -1, -1, -1, -1, -1, -1,
    -1, -1, -1, -1, -1, -1, -1,  0, -1, -1,
    -1, -1, -1, -1, -1, -1, -1, -1, -2, -1,
    -1, -1, -1, -1,  0, -1, -1, -2, -2, -2,
    -1, -1, -1, -1, -1, -1, -1, -2, -2, -2, 
    -1, -1, -1, -1, -1, -1, -2, -2, -2, -2,
    -1, -1, -1, -1, -1,  0, -2, -2, -2, -2, 
    -1, -1, -1, -1, -2, -2, -2, -2, -2, -2, 
    -1, -1, -1, -2, -2, -2, -2, -2, -2, -2, 
    -2, -2, -2, -2, -2, -2, -2, -2,  0, -2
    `);
    expect(roiMapManager).toEqual({
      map: {
        data: resultArray,
        nbPositive: 0,
        nbNegative: 2,
        width: 10,
        height: 10,
      },
      whiteRois: [],
      blackRois: [],
    });
  });
});
