import binary from 'test/binary';

import Shape from '../Shape';

describe('we check Shape class', function () {
  it('should be able to create a Shape', function () {
    let shape = new Shape({ shape: 'circle', filled: false, size: 5 });
    let mask = shape.getMask();
    expect(mask.data).toStrictEqual(
      binary`
          00100
          01010
          10001
          01010
          00100
      `);
  });

  it('should yield a cross', function () {
    let shape = new Shape();

    expect(shape.getPoints()).toStrictEqual([
      [0, -2],
      [0, -1],
      [-2, 0],
      [-1, 0],
      [0, 0],
      [1, 0],
      [2, 0],
      [0, 1],
      [0, 2]
    ]);
  });

  it('should yield the right smallCross', function () {
    let shape = new Shape({ kind: 'smallCross' });

    expect(Array.from(shape.matrix)).toStrictEqual([
      [0, 1, 0],
      [1, 1, 1],
      [0, 1, 0]
    ]);
  });

  it('should yield the right mask', function () {
    let shape = new Shape({ kind: 'smallCross' });
    let img = shape.getMask();
    expect(Array.from(img.data)).toStrictEqual([93, 0]);
  });

  it('should yield the right cross', function () {
    let shape = new Shape({ kind: 'cross' });

    expect(Array.from(shape.matrix)).toStrictEqual([
      [0, 0, 1, 0, 0],
      [0, 0, 1, 0, 0],
      [1, 1, 1, 1, 1],
      [0, 0, 1, 0, 0],
      [0, 0, 1, 0, 0]
    ]);
  });

  it('should yield the right square', function () {
    let shape = new Shape({ shape: 'square', size: 5 });
    expect(Array.from(shape.matrix)).toStrictEqual([
      [1, 1, 1, 1, 1],
      [1, 1, 1, 1, 1],
      [1, 1, 1, 1, 1],
      [1, 1, 1, 1, 1],
      [1, 1, 1, 1, 1]
    ]);

    let shape2 = new Shape({ shape: 'square', width: 5, height: 3 });
    expect(Array.from(shape2.matrix)).toStrictEqual([
      [1, 1, 1, 1, 1],
      [1, 1, 1, 1, 1],
      [1, 1, 1, 1, 1]
    ]);
  });

  it('should yield the right empty square', function () {
    let shape = new Shape({ shape: 'square', size: 5, filled: false });
    expect(Array.from(shape.matrix)).toStrictEqual([
      [1, 1, 1, 1, 1],
      [1, 0, 0, 0, 1],
      [1, 0, 0, 0, 1],
      [1, 0, 0, 0, 1],
      [1, 1, 1, 1, 1]
    ]);

    let shape2 = new Shape({ shape: 'square', width: 5, height: 3, filled: false });
    expect(Array.from(shape2.matrix)).toStrictEqual([
      [1, 1, 1, 1, 1],
      [1, 0, 0, 0, 1],
      [1, 1, 1, 1, 1]
    ]);
  });

  it('should yield the right triangle', function () {
    let shape = new Shape({ shape: 'triangle', size: 5 });
    expect(Array.from(shape.matrix)).toStrictEqual([
      [0, 0, 1, 0, 0],
      [0, 0, 1, 0, 0],
      [0, 1, 1, 1, 0],
      [0, 1, 1, 1, 0],
      [1, 1, 1, 1, 1]
    ]);

    let shape2 = new Shape({ shape: 'triangle', width: 5, height: 3 });
    expect(Array.from(shape2.matrix)).toStrictEqual([
      [0, 0, 1, 0, 0],
      [0, 1, 1, 1, 0],
      [1, 1, 1, 1, 1]
    ]);
  });

  it('should yield the right circle', function () {
    let shape = new Shape({ shape: 'circle', size: 5 });
    expect(Array.from(shape.matrix)).toStrictEqual([
      [0, 0, 1, 0, 0],
      [0, 1, 1, 1, 0],
      [1, 1, 1, 1, 1],
      [0, 1, 1, 1, 0],
      [0, 0, 1, 0, 0]
    ]);
  });

  it('should yield the right circle even size', function () {
    let shape = new Shape({ shape: 'circle', size: 6 });
    expect(Array.from(shape.matrix)).toStrictEqual([
      [0, 0, 1, 1, 0, 0],
      [0, 1, 1, 1, 1, 0],
      [1, 1, 1, 1, 1, 1],
      [1, 1, 1, 1, 1, 1],
      [0, 1, 1, 1, 1, 0],
      [0, 0, 1, 1, 0, 0]
    ]);
  });


  it('should yield the right ellipse', function () {
    let shape = new Shape({ shape: 'ellipse', width: 9, height: 5 });
    expect(Array.from(shape.matrix)).toStrictEqual([
      [0, 0, 0, 0, 1, 0, 0, 0, 0],
      [0, 1, 1, 1, 1, 1, 1, 1, 0],
      [1, 1, 1, 1, 1, 1, 1, 1, 1],
      [0, 1, 1, 1, 1, 1, 1, 1, 0],
      [0, 0, 0, 0, 1, 0, 0, 0, 0]
    ]);
  });

  it('should yield the right empty circle', function () {
    let shape = new Shape({ shape: 'circle', size: 5, filled: false });
    expect(Array.from(shape.matrix)).toStrictEqual([
      [0, 0, 1, 0, 0],
      [0, 1, 0, 1, 0],
      [1, 0, 0, 0, 1],
      [0, 1, 0, 1, 0],
      [0, 0, 1, 0, 0]
    ]);
  });

  it('should yield the right empty circle even size', function () {
    let shape = new Shape({ shape: 'circle', size: 6, filled: false });
    expect(Array.from(shape.matrix)).toStrictEqual([
      [0, 0, 1, 1, 0, 0],
      [0, 1, 0, 0, 1, 0],
      [1, 0, 0, 0, 0, 1],
      [1, 0, 0, 0, 0, 1],
      [0, 1, 0, 0, 1, 0],
      [0, 0, 1, 1, 0, 0]
    ]);
  });

  it('should yield the right empty ellipse', function () {
    let shape = new Shape({ shape: 'ellipse', width: 9, height: 5, filled: false });
    expect(Array.from(shape.matrix)).toStrictEqual([
      [0, 0, 0, 0, 1, 0, 0, 0, 0],
      [0, 1, 1, 1, 0, 1, 1, 1, 0],
      [1, 0, 0, 0, 0, 0, 0, 0, 1],
      [0, 1, 1, 1, 0, 1, 1, 1, 0],
      [0, 0, 0, 0, 1, 0, 0, 0, 0]
    ]);
  });

  it('should yield the right vertical empty ellipse', function () {
    let shape = new Shape({ shape: 'ellipse', width: 5, height: 9, filled: false });
    expect(Array.from(shape.matrix)).toStrictEqual([
      [0, 0, 1, 0, 0],
      [0, 1, 0, 1, 0],
      [0, 1, 0, 1, 0],
      [0, 1, 0, 1, 0],
      [1, 0, 0, 0, 1],
      [0, 1, 0, 1, 0],
      [0, 1, 0, 1, 0],
      [0, 1, 0, 1, 0],
      [0, 0, 1, 0, 0]
    ]);
  });

  it('should yield the right vbig circle', function () {
    let shape = new Shape({ shape: 'ellipse', size: 15, filled: false });
    expect(Array.from(shape.matrix)).toStrictEqual([
      [0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 1, 1, 1, 0, 1, 1, 1, 0, 0, 0, 0],
      [0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0],
      [0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0],
      [0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0],
      [0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0],
      [0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0],
      [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
      [0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0],
      [0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0],
      [0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0],
      [0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0],
      [0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0],
      [0, 0, 0, 0, 1, 1, 1, 0, 1, 1, 1, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0]
    ]);
  });
});

