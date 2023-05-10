import { fromMask } from '../../roi';
import { angle } from '../../utils/geometry/angles';
import { getMbr } from '../getMbr';

test('verify that angle is correct', () => {
  const mask = testUtils.createMask(`
      0 0 0 0 0 0 0 0
      0 0 0 1 1 0 0 0
      0 0 0 1 1 0 0 0
      0 0 1 1 1 1 1 1
      0 0 1 1 1 1 1 1
      0 0 0 1 1 0 0 0
      0 0 0 1 1 0 0 0
      0 0 0 0 0 0 0 0
    `);

  const result = getMbr(mask).points;
  expect(result).toHaveLength(4);

  for (let i = 0; i < 4; i++) {
    let currentAngle = angle(
      result[(i + 1) % 4],
      result[i],
      result[(i + 2) % 4],
    );
    expect(Math.abs(currentAngle)).toBeCloseTo(Math.PI / 2, 1e-6);
  }
});

test('small rectangular ROI', () => {
  const mask = testUtils.createMask([
    [0, 0, 1],
    [0, 1, 1],
    [1, 1, 0],
    [1, 0, 0],
  ]);

  const result = getMbr(mask).points;
  expect(result).toBeDeepCloseTo(
    [
      { column: 4, row: 1 },
      { column: 0.5, row: 4.5 },
      { column: -1, row: 3 },
      { column: 2.5, row: -0.5 },
    ],
    6,
  );
});

test('horizontal MBR', () => {
  const mask = testUtils.createMask(
    `
      1 0 0 0 0 0 0 1
      0 1 1 1 1 1 1 0
      1 0 0 1 1 0 1 0
    `,
  );

  const result = getMbr(mask);

  expect(result).toBeDeepCloseTo({
    points: [
      { column: 8, row: 3 },
      { column: 0, row: 3 },
      { column: 0, row: 0 },
      { column: 8, row: 0 },
    ],
    angle: 0,
    width: 8,
    height: 3,
    perimeter: 22,
    surface: 24,
    aspectRatio: 3 / 8,
  });
});

test('other horizontal MBR', () => {
  const mask = testUtils.createMask(
    `
      1 0 0 0 1 0 
      0 1 1 1 1 0 
      1 0 1 1 0 1 
    `,
  );

  const result = getMbr(mask);
  expect(result).toBeDeepCloseTo({
    points: [
      { column: 6, row: 3 },
      { column: 0, row: 3 },
      { column: 0, row: 0 },
      { column: 6, row: 0 },
    ],
    angle: 0,
    width: 6,
    height: 3,
    surface: 18,
    perimeter: 18,
    aspectRatio: 0.5,
  });
});

test('small tilted rectangle', () => {
  const mask = testUtils.createMask(`
     0 1 0
     1 1 1
     0 1 0
      `);

  const result = getMbr(mask);
  expect(result.points).toBeDeepCloseTo(
    [
      { column: 1.5, row: 3.5 },
      { column: -0.5, row: 1.5 },
      { column: 1.5, row: -0.5 },
      { column: 3.5, row: 1.5 },
    ],
    6,
  );
  expect(result.angle).toBeCloseTo(-45);
});

test('large tilted rectangle', () => {
  const mask = testUtils.createMask(` 
        0 0 1 0 0 0
        0 1 1 1 0 0
        1 1 1 1 1 0
        0 1 1 1 1 1
        0 0 1 1 1 0
        0 0 0 1 0 0
      `);
  const result = getMbr(mask).points;
  expect(result).toBeDeepCloseTo(
    [
      { column: 2.5, row: -0.5 },
      { column: 6.5, row: 3.5 },
      { column: 3.5, row: 6.5 },
      { column: -0.5, row: 2.5 },
    ],
    6,
  );
});

test('one point ROI', () => {
  const mask = testUtils.createMask([[1]]);
  const result = getMbr(mask).points;
  expect(result).toBeDeepCloseTo([
    { column: 0, row: 1 },
    { column: 0, row: 0 },
    { column: 1, row: 0 },
    { column: 1, row: 1 },
  ]);
});

test('2 points ROI', () => {
  const mask = testUtils.createMask([
    [1, 0],
    [0, 1],
  ]);
  const result = getMbr(mask).points;

  expect(result).toBeDeepCloseTo(
    [
      { column: 0.5, row: -0.5 },
      { column: 2.5, row: 1.5 },
      { column: 1.5, row: 2.5 },
      { column: -0.5, row: 0.5 },
    ],
    6,
  );
});

test('small triangular ROI', () => {
  const mask = testUtils.createMask([
    [1, 1],
    [1, 0],
  ]);

  const result = getMbr(mask).points;

  expect(result).toBeDeepCloseTo(
    [
      { column: 0, row: 2 },
      { column: 0, row: 0 },
      { column: 2, row: 0 },
      { column: 2, row: 2 },
    ],
    6,
  );
});

test('empty mask', () => {
  const mask = testUtils.createMask([
    [0, 0],
    [0, 0],
  ]);

  const result = getMbr(mask);

  expect(result).toStrictEqual({
    points: [],
    angle: 0,
    width: 0,
    height: 0,
    surface: 0,
    perimeter: 0,
    aspectRatio: 0,
  });
});

test('draw mbr on large image', () => {
  const image = testUtils.load('various/grayscale_by_zimmyrose.png');
  const rgbaImage = image.convertColor('RGBA');
  const mask = image.threshold({ threshold: 200 / 255 });
  const roiMapManager = fromMask(mask);

  const rois = roiMapManager.getRois({ kind: 'white' });

  const roi = rois.sort((a, b) => b.surface - a.surface)[0];

  const roiMask = roi.getMask({ solidFill: true });
  let mbr = roiMask.getMbr();

  let result = rgbaImage.paintMask(roiMask, {
    origin: roi.origin,
    color: [0, 0, 255, 255],
  });

  result = result.drawPolygon(mbr.points, {
    origin: roi.origin,
    strokeColor: [0, 255, 0, 255],
  });

  expect(result).toMatchImageSnapshot();
});

test('other horizontal MBR', () => {
  const mask = testUtils.createMask(
    `
      1 0 0 0 1 0 
      0 1 1 1 1 0 
      1 0 1 1 0 1 
    `,
  );

  const result = getMbr(mask);
  expect(result.aspectRatio).toBeCloseTo(0.5);
});

test('small triangular ROI', () => {
  const mask = testUtils.createMask([
    [0, 1, 0],
    [1, 1, 1],
    [0, 1, 0],
  ]);

  const result = getMbr(mask).aspectRatio;

  expect(result).toBeCloseTo(1);
});

test('small triangular ROI', () => {
  const mask = testUtils.createMask([
    [0, 1, 0],
    [0, 1, 0],
    [0, 1, 0],
    [0, 1, 0],
  ]);

  const result = getMbr(mask).aspectRatio;

  expect(result).toStrictEqual(0.25);
});

test('small triangular ROI', () => {
  const mask = testUtils.createMask([[1, 1, 1, 1]]);

  const result = getMbr(mask).aspectRatio;

  expect(result).toStrictEqual(0.25);
});
