import { encodePng } from '..';
import { decode } from '../../load/decode';

test('should encode what it decoded', () => {
  const buffer = testUtils.loadBuffer('formats/grey8.png');
  const img = decode(buffer);
  expect(img.size).toBe(2700);
  const imgDup = decode(encodePng(img));
  expect(imgDup).toMatchImage(img);
});

test('should encode a 16bits image correctly', () => {
  const img = testUtils.load('formats/tif/grey16.tif');
  expect(img.size).toBe(2700);
  expect(img.bitDepth).toBe(16);
  const imgDup = decode(encodePng(img));
  expect(imgDup.bitDepth).toBe(16);
  expect(imgDup).toMatchImage(img);
});

test('add mask test', () => {
  const img = testUtils.load('formats/tif/grey16.tif');
  const mask = img.threshold();
  const imgDup = decode(encodePng(mask));
  expect(imgDup.colorModel).toBe('GREY');
  expect(imgDup.bitDepth).toBe(8);
});
