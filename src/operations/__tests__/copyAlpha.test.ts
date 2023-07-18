import { copyAlpha } from '../convertColor';

test('source and dest different sizes', () => {
  const source = testUtils.createRgbaImage([[10, 20, 30, 40, 60, 70, 80, 90]]);
  const dest = testUtils.createRgbaImage([[10, 20, 30, 40]]);

  expect(() => {
    copyAlpha(source, dest);
  }).toThrow(/source and destination have different sizes/);
});

test('source has no alpha', () => {
  const source = testUtils.createRgbImage([[10, 20, 30]]);
  const dest = testUtils.createRgbaImage([[10, 20, 30, 40]]);

  expect(() => {
    copyAlpha(source, dest);
  }).toThrow(/source image does not have alpha/);
});

test('dest has no alpha', () => {
  const dest = testUtils.createRgbImage([[10, 20, 30]]);
  const source = testUtils.createRgbaImage([[10, 20, 30, 40]]);

  expect(() => {
    copyAlpha(source, dest);
  }).toThrow(/destination does not have alpha/);
});
