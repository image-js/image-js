import array from 'test/array';
import binary from 'test/binary';
import { Image } from 'test/common';

describe('we check paintPolygon', function () {
  it('should yield the painted image with a line', function () {
    let size = 5;
    let data = new Array(size * size * 3);
    for (let i = 0; i < data.length; i++) {
      data[i] = i;
    }
    let image = new Image(size, size, data, { kind: 'RGB' });

    let points = [
      [1, 1],
      [3, 3],
    ];
    image.paintPolygon(points);

    let painted = array`
      0, 0, 0, 0, 0
      0, 1, 0, 0, 0
      0, 0, 1, 0, 0
      0, 0, 0, 1, 0
      0, 0, 0, 0, 0
    `;

    let expected = getExpected(painted, [255, 0, 0]);

    expect(Array.from(image.data)).toStrictEqual(expected);
  });

  it('should yield the painted image with a rectangle', function () {
    let size = 5;
    let data = new Array(size * size * 3);
    for (let i = 0; i < data.length; i++) {
      data[i] = i;
    }
    let image = new Image(size, size, data, { kind: 'RGB' });

    let points = [
      [1, 1],
      [4, 1],
      [4, 3],
      [1, 3],
    ];
    image.paintPolygon(points);

    let painted = array`
      0, 0, 0, 0, 0
      0, 1, 1, 1, 1
      0, 1, 0, 0, 1
      0, 1, 1, 1, 1
      0, 0, 0, 0, 0
    `;

    let expected = getExpected(painted, [255, 0, 0]);

    expect(Array.from(image.data)).toStrictEqual(expected);
  });

  it.skip('should yield the painted image with a border square', function () {
    let size = 5;
    let data = new Array(size * size * 3);
    for (let i = 0; i < data.length; i++) {
      data[i] = i;
    }
    let image = new Image(size, size, data, { kind: 'RGB' });

    let points = [
      [1, 1],
      [3, 1],
      [3, 3],
      [1, 3],
    ];
    image.paintPolygon(points, { filled: false });

    let painted = array`
      0, 0, 0, 0, 0
      0, 1, 1, 1, 0
      0, 1, 0, 1, 0
      0, 1, 1, 1, 0
      0, 0, 0, 0, 0
    `;

    let expected = getExpected(painted, [255, 0, 0]);

    expect(Array.from(image.data)).toStrictEqual(expected);
  });

  it.skip('should yield the painted image with a filled square', function () {
    let size = 5;
    let data = new Array(size * size * 3);
    for (let i = 0; i < data.length; i++) {
      data[i] = i;
    }
    let image = new Image(size, size, data, { kind: 'RGB' });

    let points = [
      [1, 1],
      [3, 1],
      [3, 3],
      [1, 3],
    ];
    image.paintPolygon(points, { filled: true });

    let painted = array`
      0, 0, 0, 0, 0
      0, 1, 1, 1, 0
      0, 1, 1, 1, 0
      0, 1, 1, 1, 0
      0, 0, 0, 0, 0
    `;

    let expected = getExpected(painted, [255, 0, 0]);

    expect(Array.from(image.data)).toStrictEqual(expected);
  });

  it('should yield the painted image B/W image with a triangle', function () {
    let size = 5;
    let data = new Array(size * size);
    for (let i = 0; i < data.length; i++) {
      data[i] = i;
    }
    let image = new Image(size, size, data, { kind: 'GREY' });

    let points = [
      [2, 0],
      [4, 2],
      [0, 2],
    ];
    image.paintPolygon(points, { filled: true });

    let painted = array`
      0, 0, 1, 0, 0,
      0, 1, 1, 1, 0,
      1, 1, 1, 1, 1,
      0, 0, 0, 0, 0,
      0, 0, 0, 0, 0,
    `;

    let expected = getExpectedGrey(painted, [255, 0, 0]);
    expect(Array.from(image.data)).toStrictEqual(expected);
  });

  it('when there is two segments out of the polygon', function () {
    let size = 5;
    let data = new Array(size * size);
    for (let i = 0; i < data.length; i++) {
      data[i] = i;
    }
    let image = new Image(size, size, data, { kind: 'GREY' });

    let points = [
      [0, 0],
      [2, 0],
      [4, 2],
      [2, 2],
      [2, 4],
      [2, 2],
      [0, 2],
      [2, 0],
      [0, 0],
    ];
    image.paintPolygon(points, { filled: true });

    let painted = array`
      1, 1, 1, 0, 0
      0, 1, 1, 1, 0
      1, 1, 1, 1, 1
      0, 0, 1, 0, 0
      0, 0, 1, 0, 0
    `;

    let expected = getExpectedGrey(painted, [255, 0, 0]);
    expect(Array.from(image.data)).toStrictEqual(expected);
  });

  it('should yield the painted binary image with a triangle', function () {
    let size = 5;
    let data = new Uint8Array(Math.ceil((size * size) / 8));
    let image = new Image(size, size, data, { kind: 'BINARY' });

    let points = [
      [2, 0],
      [4, 2],
      [0, 2],
    ];
    image.paintPolygon(points);

    let painted = binary`
      00100
      01010
      11111
      00000
      00000
    `;

    expect(Array.from(image.data)).toStrictEqual(Array.from(painted.data));
  });

  it('should yield the filled painted binary image with a triangle', function () {
    let size = 5;
    let data = new Uint8Array(Math.ceil((size * size) / 8));
    let image = new Image(size, size, data, { kind: 'BINARY' });

    let points = [
      [2, 0],
      [4, 2],
      [0, 2],
    ];
    image.paintPolygon(points, { filled: true });

    let painted = binary`
      00100
      01110
      11111
      00000
      00000
    `;

    expect(Array.from(image.data)).toStrictEqual(Array.from(painted.data));
  });

  it('should yield the filled painted binary image with a cut triangle', function () {
    let size = 5;
    let data = new Uint8Array(Math.ceil((size * size) / 8)).fill(0xff);
    let image = new Image(size, size, data, { kind: 'BINARY' });

    let points = [
      [2, 0],
      [4, 2],
      [0, 2],
    ];
    image.paintPolygon(points, { filled: true, color: 0 });

    let painted = binary`
      11011
      10001
      00000
      11111
      11111
    `;

    expect(Array.from(image.data)).toStrictEqual(Array.from(painted.data));
  });
});

function getExpected(painted, color) {
  let result = new Array(painted.length * 3);
  for (let i = 0; i < result.length; i++) {
    result[i] = i;
  }
  for (let i = 0; i < result.length / 3; i++) {
    if (painted[i] === 1) {
      result[i * 3] = color[0];
      result[i * 3 + 1] = color[1];
      result[i * 3 + 2] = color[2];
    }
  }
  return result;
}

function getExpectedGrey(painted, color) {
  let result = new Array(painted.length);
  for (let i = 0; i < result.length; i++) {
    result[i] = i;
  }
  for (let i = 0; i < result.length; i++) {
    if (painted[i] === 1) {
      result[i] = color[0];
    }
  }
  return result;
}
