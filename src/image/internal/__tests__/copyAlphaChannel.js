import { Image } from 'test/common';

import copyAlphaChannel from '../copyAlphaChannel';

test('copy from RGBA to RGBA', () => {
  const from = new Image(3, 1, [1, 1, 1, 0, 2, 2, 2, 127, 3, 3, 3, 255]);
  const to = new Image(3, 1);
  copyAlphaChannel(from, to);
  expect(Array.from(to.data)).toStrictEqual([0, 0, 0, 0, 0, 0, 0, 127, 0, 0, 0, 255]);
});

test('copy from RGBA to GREYA', () => {
  const from = new Image(3, 1, [1, 1, 1, 0, 2, 2, 2, 127, 3, 3, 3, 255]);
  const to = new Image(3, 1, { kind: 'GREYA' });
  copyAlphaChannel(from, to);
  expect(Array.from(to.data)).toStrictEqual([0, 0, 0, 127, 0, 255]);
});

test('copy from GREYA to RGBA', () => {
  const from = new Image(3, 1, [1, 0, 2, 127, 3, 255], { kind: 'GREYA' });
  const to = new Image(3, 1);
  copyAlphaChannel(from, to);
  expect(Array.from(to.data)).toStrictEqual([0, 0, 0, 0, 0, 0, 0, 127, 0, 0, 0, 255]);
});

test('ignores when no alpha in source', () => {
  const from = new Image(3, 1, [1, 2, 3], { kind: 'GREY' });
  const to = new Image(3, 1, { kind: 'GREYA' });
  copyAlphaChannel(from, to);
  expect(Array.from(to.data)).toStrictEqual([0, 255, 0, 255, 0, 255]);
});

test('ignores when no alpha in destination', () => {
  const from = new Image(3, 1, [1, 0, 2, 127, 3, 255], { kind: 'GREYA' });
  const to = new Image(3, 1, { kind: 'GREY' });
  copyAlphaChannel(from, to);
  expect(Array.from(to.data)).toStrictEqual([0, 0, 0]);
});

test('ignores when no alpha at all destination', () => {
  const from = new Image(3, 1, [1, 2, 3], { kind: 'GREY' });
  const to = new Image(3, 1, { kind: 'GREY' });
  copyAlphaChannel(from, to);
  expect(Array.from(to.data)).toStrictEqual([0, 0, 0]);
});
