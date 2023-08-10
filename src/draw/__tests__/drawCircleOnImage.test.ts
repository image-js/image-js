import { Image } from '../../Image';

test('draw circle image', () => {
  const image = testUtils.createRgbImage([
    [100, 150, 200, 100, 150, 0, 0, 100, 150],
    [100, 200, 5, 3, 200, 0, 3, 200, 0],
    [150, 200, 255, 6, 150, 0, 200, 255, 6],
  ]);

  const center = { row: 1, column: 1 };
  const radius = 1;
  const expected = image.drawCircle(center, radius, { color: [255, 0, 0] });
  expect(expected).toMatchImageData([
    [100, 150, 200, 255, 0, 0, 0, 100, 150],
    [255, 0, 0, 3, 200, 0, 255, 0, 0],
    [150, 200, 255, 255, 0, 0, 200, 255, 6],
  ]);
  expect(expected).not.toBe(image);
});

test('floating point values', () => {
  const image = testUtils.createRgbImage([
    [100, 150, 200, 100, 150, 0, 0, 100, 150],
    [100, 200, 5, 3, 200, 0, 3, 200, 0],
    [150, 200, 255, 6, 150, 0, 200, 255, 6],
  ]);

  const center = { row: 0.99, column: 0.99 };
  const radius = 1;
  const expected = image.drawCircle(center, radius, { color: [255, 0, 0] });
  expect(expected).toMatchImageData([
    [100, 150, 200, 255, 0, 0, 0, 100, 150],
    [255, 0, 0, 3, 200, 0, 255, 0, 0],
    [150, 200, 255, 255, 0, 0, 200, 255, 6],
  ]);
  expect(expected).not.toBe(image);
});
test('draw filled circle image', () => {
  const image = testUtils.createRgbImage([
    [100, 150, 200, 100, 150, 0, 0, 100, 150],
    [100, 200, 5, 3, 200, 0, 3, 200, 0],
    [150, 200, 255, 6, 150, 0, 200, 255, 6],
  ]);

  const center = { row: 1, column: 1 };
  const radius = 1;
  const expected = image.drawCircle(center, radius, {
    color: [255, 0, 0],
    fill: [1, 2, 3],
  });
  expect(expected).toMatchImageData([
    [100, 150, 200, 255, 0, 0, 0, 100, 150],
    [255, 0, 0, 1, 2, 3, 255, 0, 0],
    [150, 200, 255, 255, 0, 0, 200, 255, 6],
  ]);
  expect(expected).not.toBe(image);
});

test('draw circle with out parameter set to self', () => {
  const image = testUtils.createRgbaImage([
    [100, 150, 200, 1, 100, 150, 0, 5, 0, 100, 150, 55],
    [100, 200, 5, 3, 3, 200, 0, 3, 8, 200, 0, 33],
    [150, 200, 255, 6, 150, 0, 200, 8, 255, 6, 10, 11],
  ]);
  const center = { row: 1, column: 1 };
  const radius = 1;
  const expected = image.drawCircle(center, radius, {
    color: [255, 0, 0, 255],
    out: image,
  });
  expect(expected).toMatchImageData([
    [100, 150, 200, 1, 255, 0, 0, 255, 0, 100, 150, 55],
    [255, 0, 0, 255, 3, 200, 0, 3, 255, 0, 0, 255],
    [150, 200, 255, 6, 255, 0, 0, 255, 255, 6, 10, 11],
  ]);
  expect(expected).toBe(image);
});

test('draw circle with out parameter', () => {
  const out = new Image(3, 3);
  const image = testUtils.createRgbImage([
    [100, 150, 200, 100, 150, 0, 0, 100, 150],
    [100, 200, 5, 3, 200, 0, 3, 200, 0],
    [150, 200, 255, 6, 150, 0, 200, 255, 6],
  ]);
  const center = { row: 1, column: 1 };
  const radius = 1;
  const expected = image.drawCircle(center, radius, {
    color: [255, 0, 0],
    out,
  });

  expect(expected).toMatchImageData([
    [100, 150, 200, 255, 0, 0, 0, 100, 150],
    [255, 0, 0, 3, 200, 0, 255, 0, 0],
    [150, 200, 255, 255, 0, 0, 200, 255, 6],
  ]);
  expect(expected).toBe(out);
  expect(expected).not.toBe(image);
});

test('draw grey circle', () => {
  const image = testUtils.createGreyImage([
    [0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0],
  ]);
  const center = { row: 2, column: 3 };
  const radius = 2;
  const expected = image.drawCircle(center, radius, {
    color: [1],
  });
  expect(expected).toMatchImageData([
    [0, 0, 1, 1, 1, 0],
    [0, 1, 0, 0, 0, 1],
    [0, 1, 0, 0, 0, 1],
    [0, 1, 0, 0, 0, 1],
    [0, 0, 1, 1, 1, 0],
  ]);
  expect(expected).not.toBe(image);
});

test('should handle points with floating values', () => {
  const image = testUtils.createGreyImage([
    [0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0],
  ]);
  const center = { row: 2.1, column: 3.1 };
  const radius = 2.1;
  const expected = image.drawCircle(center, radius, {
    color: [1],
  });
  expect(expected).toMatchImageData([
    [0, 0, 1, 1, 1, 0],
    [0, 1, 0, 0, 0, 1],
    [0, 1, 0, 0, 0, 1],
    [0, 1, 0, 0, 0, 1],
    [0, 0, 1, 1, 1, 0],
  ]);
  expect(expected).not.toBe(image);
});

test('negative radius error', () => {
  const image = testUtils.createGreyImage([
    [0, 0, 0],
    [0, 0, 0],
    [0, 0, 0],
  ]);
  const center = { row: 1, column: 1 };
  const radius = -1;
  expect(() => {
    image.drawCircle(center, radius, {
      color: [1],
    });
  }).toThrow('circle radius must be positive');
});

test('draw grey filled circle, radius=0', () => {
  const image = testUtils.createGreyImage([
    [0, 0, 0],
    [0, 0, 0],
    [0, 0, 0],
  ]);
  const center = { row: 1, column: 1 };
  const radius = 0;
  const expected = image.drawCircle(center, radius, {
    color: [1],
    fill: [2],
  });
  expect(expected).toMatchImageData([
    [0, 0, 0],
    [0, 1, 0],
    [0, 0, 0],
  ]);
  expect(expected).not.toBe(image);
});

test('draw grey filled circle, radius=1', () => {
  const image = testUtils.createGreyImage([
    [0, 0, 0],
    [0, 0, 0],
    [0, 0, 0],
  ]);
  const center = { row: 1, column: 1 };
  const radius = 1;
  const expected = image.drawCircle(center, radius, {
    color: [1],
    fill: [2],
  });
  expect(expected).toMatchImageData([
    [0, 1, 0],
    [1, 2, 1],
    [0, 1, 0],
  ]);
  expect(expected).not.toBe(image);
});

test('draw grey filled circle', () => {
  const image = testUtils.createGreyImage([
    [0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0],
  ]);
  const center = { row: 2, column: 3 };
  const radius = 2;
  const expected = image.drawCircle(center, radius, {
    color: [1],
    fill: [2],
  });
  expect(expected).toMatchImageData([
    [0, 0, 1, 1, 1, 0],
    [0, 1, 2, 2, 2, 1],
    [0, 1, 2, 2, 2, 1],
    [0, 1, 2, 2, 2, 1],
    [0, 0, 1, 1, 1, 0],
  ]);
  expect(expected).not.toBe(image);
});

test('big image not filled', () => {
  const image = testUtils.createGreyImage([
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  ]);
  const center = { row: 5, column: 6 };
  const radius = 4;
  const expected = image.drawCircle(center, radius, {
    color: [1],
  });
  expect(expected).toMatchImageData([
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 1, 1, 1, 0, 0, 0, 0],
    [0, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0],
    [0, 0, 0, 1, 0, 0, 0, 0, 0, 1, 0, 0],
    [0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 1, 0],
    [0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 1, 0],
    [0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 1, 0],
    [0, 0, 0, 1, 0, 0, 0, 0, 0, 1, 0, 0],
    [0, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0],
    [0, 0, 0, 0, 0, 1, 1, 1, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  ]);
  expect(expected).not.toBe(image);
});

test('larger floating point radius', () => {
  const image = testUtils.createGreyImage([
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  ]);
  const center = { row: 5.1, column: 6.05 };
  const radius = 4.2;
  const expected = image.drawCircle(center, radius, {
    color: [1],
  });

  expect(expected).toMatchImageData([
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 1, 1, 1, 0, 0, 0, 0],
    [0, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0],
    [0, 0, 0, 1, 0, 0, 0, 0, 0, 1, 0, 0],
    [0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 1, 0],
    [0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 1, 0],
    [0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 1, 0],
    [0, 0, 0, 1, 0, 0, 0, 0, 0, 1, 0, 0],
    [0, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0],
    [0, 0, 0, 0, 0, 1, 1, 1, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  ]);
  expect(expected).not.toBe(image);
});

test('big image filled', () => {
  const image = testUtils.createGreyImage([
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  ]);
  const center = { row: 5, column: 6 };
  const radius = 4;
  const expected = image.drawCircle(center, radius, {
    color: [1],
    fill: [2],
  });
  expect(expected).toMatchImageData([
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 1, 1, 1, 0, 0, 0, 0],
    [0, 0, 0, 0, 1, 2, 2, 2, 1, 0, 0, 0],
    [0, 0, 0, 1, 2, 2, 2, 2, 2, 1, 0, 0],
    [0, 0, 1, 2, 2, 2, 2, 2, 2, 2, 1, 0],
    [0, 0, 1, 2, 2, 2, 2, 2, 2, 2, 1, 0],
    [0, 0, 1, 2, 2, 2, 2, 2, 2, 2, 1, 0],
    [0, 0, 0, 1, 2, 2, 2, 2, 2, 1, 0, 0],
    [0, 0, 0, 0, 1, 2, 2, 2, 1, 0, 0, 0],
    [0, 0, 0, 0, 0, 1, 1, 1, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  ]);
  expect(expected).not.toBe(image);
});

test('points outside image', () => {
  const image = testUtils.createGreyImage([
    [0, 0, 0],
    [0, 0, 0],
    [0, 0, 0],
  ]);
  const center = { row: 1, column: 2 };
  const radius = 1;
  const expected = image.drawCircle(center, radius, {
    color: [1],
    fill: [2],
  });
  expect(expected).toMatchImageData([
    [0, 0, 1],
    [0, 1, 2],
    [0, 0, 1],
  ]);
});

test('default options', () => {
  const image = testUtils.createGreyImage([
    [0, 0, 0],
    [0, 0, 0],
    [0, 0, 0],
  ]);
  const center = { row: 1, column: 1 };
  const radius = 1;
  const expected = image.drawCircle(center, radius, { color: [1] });
  expect(expected).toMatchImageData([
    [0, 1, 0],
    [1, 0, 1],
    [0, 1, 0],
  ]);
});
