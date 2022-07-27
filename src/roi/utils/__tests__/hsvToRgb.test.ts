import { hsvToRgb } from '../hsvToRgb';

test('black', () => {
  const rgb = new Uint8Array([0, 0, 0]);
  expect(hsvToRgb([50, 100, 0])).toStrictEqual(rgb);
});

test('white', () => {
  const rgb = new Uint8Array([255, 255, 255]);
  expect(hsvToRgb([50, 0, 255])).toStrictEqual(rgb);
});

test('red', () => {
  const rgb = new Uint8Array([255, 0, 0]);
  expect(hsvToRgb([0, 255, 255])).toStrictEqual(rgb);
});

test('green', () => {
  const rgb = new Uint8Array([0, 255, 0]);
  expect(hsvToRgb([120, 255, 255])).toStrictEqual(rgb);
});

test('blue', () => {
  const rgb = new Uint8Array([0, 0, 255]);
  expect(hsvToRgb([240, 255, 255])).toStrictEqual(rgb);
});

test('random color', () => {
  const rgb = new Uint8Array([255, 0, 42]);
  expect(hsvToRgb([350, 255, 255])).toStrictEqual(rgb);
});

test('other random color', () => {
  const rgb = new Uint8Array([0, 127, 255]);
  expect(hsvToRgb([210, 255, 255])).toStrictEqual(rgb);
});

test('yet another random color', () => {
  const rgb = new Uint8Array([127, 255, 0]);
  expect(hsvToRgb([90, 255, 255])).toStrictEqual(rgb);
});
