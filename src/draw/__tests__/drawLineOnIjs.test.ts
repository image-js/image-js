import { IJS } from '../../IJS';
import { drawLineOnIjs } from '../drawLineOnIjs';

test('RGB image', () => {
  const image = testUtils.createRgbImage([
    [100, 150, 200, 100, 150, 0],
    [100, 200, 5, 3, 200, 0],
    [150, 200, 255, 6, 150, 0],
  ]);

  const from = { row: 0, column: 0 };
  const to = { row: 1, column: 1 };
  const result = image.drawLine(from, to, { strokeColor: [255, 0, 0] });

  expect(result).toMatchImageData([
    [255, 0, 0, 100, 150, 0],
    [100, 200, 5, 255, 0, 0],
    [150, 200, 255, 6, 150, 0],
  ]);
  expect(result).not.toBe(image);
});

test('out parameter set to self', () => {
  const image = testUtils.createRgbImage([
    [100, 150, 200, 100, 150, 0],
    [100, 200, 5, 3, 200, 0],
    [150, 200, 255, 6, 150, 0],
  ]);

  const from = { row: 0, column: 0 };
  const to = { row: 1, column: 1 };
  const result = image.drawLine(from, to, {
    strokeColor: [255, 0, 0],
    out: image,
  });

  expect(result).toMatchImageData([
    [255, 0, 0, 100, 150, 0],
    [100, 200, 5, 255, 0, 0],
    [150, 200, 255, 6, 150, 0],
  ]);
  expect(result).toBe(image);
});

test('out to other image', () => {
  const out = new IJS(2, 3);
  const image = testUtils.createRgbImage([
    [100, 150, 200, 100, 150, 0],
    [100, 200, 5, 3, 200, 0],
    [150, 200, 255, 6, 150, 0],
  ]);
  const from = { row: 0, column: 0 };
  const to = { row: 1, column: 1 };
  const result = image.drawLine(from, to, {
    strokeColor: [255, 0, 0],
    out,
  });

  expect(result).toMatchImageData([
    [255, 0, 0, 100, 150, 0],
    [100, 200, 5, 255, 0, 0],
    [150, 200, 255, 6, 150, 0],
  ]);
  expect(result).toBe(out);
  expect(result).not.toBe(image);
});

test('draw nearly horizontal line', () => {
  const image = testUtils.createGreyImage([
    [0, 0, 0, 0],
    [0, 0, 0, 0],
    [0, 0, 0, 0],
    [0, 0, 0, 0],
  ]);
  const from = { row: 1, column: 0 };
  const to = { row: 2, column: 3 };
  const result = image.drawLine(from, to, {
    strokeColor: [1],
  });
  expect(result).toMatchImageData([
    [0, 0, 0, 0],
    [1, 1, 0, 0],
    [0, 0, 1, 1],
    [0, 0, 0, 0],
  ]);
  expect(result).not.toBe(image);
});

test('draw nearly vertical line', () => {
  const image = testUtils.createGreyImage([
    [0, 0, 0, 0],
    [0, 0, 0, 0],
    [0, 0, 0, 0],
    [0, 0, 0, 0],
  ]);
  const from = { row: 0, column: 1 };
  const to = { row: 3, column: 2 };
  const result = image.drawLine(from, to, {
    strokeColor: [1],
  });
  expect(result).toMatchImageData([
    [0, 1, 0, 0],
    [0, 1, 0, 0],
    [0, 0, 1, 0],
    [0, 0, 1, 0],
  ]);
  expect(result).not.toBe(image);
});

test('same from and to', () => {
  const image = testUtils.createGreyImage([
    [1, 0, 0, 0],
    [1, 0, 0, 0],
    [1, 0, 0, 0],
    [1, 0, 0, 0],
  ]);
  const from = { row: 0, column: 1 };
  const to = { row: 0, column: 1 };
  const result = image.drawLine(from, to, {
    strokeColor: [1],
  });

  expect(result).toMatchImageData([
    [1, 1, 0, 0],
    [1, 0, 0, 0],
    [1, 0, 0, 0],
    [1, 0, 0, 0],
  ]);
  expect(result).not.toBe(image);
});

test('point contains image.width and image.height', () => {
  const image = testUtils.createGreyImage([
    [0, 0, 0, 0],
    [0, 0, 0, 0],
    [0, 0, 0, 0],
    [0, 0, 0, 0],
  ]);
  const from = { row: 0, column: 0 };
  const to = { row: image.height, column: image.width };
  const result = image.drawLine(from, to, {
    strokeColor: [1],
  });

  expect(result).toMatchImageData([
    [1, 0, 0, 0],
    [0, 1, 0, 0],
    [0, 0, 1, 0],
    [0, 0, 0, 1],
  ]);
});

test('default options', () => {
  const image = testUtils.createGreyImage([
    [0, 0, 0, 0],
    [0, 0, 0, 0],
    [0, 0, 0, 0],
    [0, 0, 0, 0],
  ]);

  const from = { row: 0, column: 0 };
  const to = { row: image.height, column: image.width };
  const result = drawLineOnIjs(image, from, to);

  expect(result).toMatchImage(image);
});

test('complicated line', () => {
  const image = testUtils.createGreyImage([
    [0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0],
  ]);

  const from = { column: 0, row: 2 };
  const to = { column: 4, row: 0 };

  const result = image.drawLine(from, to, {
    strokeColor: [1],
  });
  expect(result).toMatchImageData([
    [0, 0, 0, 1, 1],
    [0, 1, 1, 0, 0],
    [1, 0, 0, 0, 0],
  ]);
});

test('big image example', () => {
  const image = testUtils.createGreyImage([
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  ]);

  const from = { row: 0, column: 4 };
  const to = { row: 9, column: 9 };
  const result = image.drawLine(from, to, {
    strokeColor: [1],
  });
  expect(result).toMatchImageData([
    [0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0],
  ]);
});

test('line out of image', () => {
  const image = testUtils.createGreyImage([
    [0, 0, 0, 0],
    [0, 0, 0, 0],
    [0, 0, 0, 0],
    [0, 0, 0, 0],
  ]);
  const from = { row: 0, column: 0 };
  const to = { row: 3, column: 8 };
  const result = image.drawLine(from, to, {
    strokeColor: [1],
    origin: { column: 0, row: 0 },
  });

  expect(result).toMatchImageData([
    [1, 1, 0, 0],
    [0, 0, 1, 1],
    [0, 0, 0, 0],
    [0, 0, 0, 0],
  ]);
});

test('different origin', () => {
  const image = testUtils.createGreyImage([
    [1, 0, 0, 0],
    [1, 0, 0, 0],
    [1, 0, 0, 0],
    [1, 0, 0, 0],
  ]);
  const from = { row: 0, column: 1 };
  const to = { row: 1, column: 0 };
  const result = image.drawLine(from, to, {
    strokeColor: [1],
    origin: { column: 1, row: 1 },
  });

  expect(result).toMatchImageData([
    [1, 0, 0, 0],
    [1, 0, 1, 0],
    [1, 1, 0, 0],
    [1, 0, 0, 0],
  ]);
  expect(result).not.toBe(image);
});

test('different origin, line out of image', () => {
  const image = testUtils.createGreyImage([
    [0, 0, 0, 0],
    [0, 0, 0, 0],
    [0, 0, 0, 0],
    [0, 0, 0, 0],
  ]);
  const points = [
    { row: 0, column: 0 },
    { row: 3, column: 3 },
  ];
  let result = image.drawLine(points[0], points[1], {
    origin: { column: 0, row: 0 },
    strokeColor: [1],
  });
  expect(result).toMatchImageData([
    [1, 0, 0, 0],
    [0, 1, 0, 0],
    [0, 0, 1, 0],
    [0, 0, 0, 1],
  ]);

  result = image.drawLine(points[0], points[1], {
    origin: { column: 3, row: 0 },
    strokeColor: [1],
  });
  expect(result).toMatchImageData([
    [0, 0, 0, 1],
    [0, 0, 0, 0],
    [0, 0, 0, 0],
    [0, 0, 0, 0],
  ]);
  expect(result).not.toBe(image);
});
