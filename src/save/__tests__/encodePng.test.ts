import { encodePng } from '..';
import { decode } from '../../load/decode';

test('should encode what it decoded', () => {
  const buffer = testUtils.loadBuffer('formats/grey8.png');
  const img = decode(buffer);
  expect(img.size).toBe(2700);
  const imgDup = decode(encodePng(img));
  expect(imgDup).toMatchImage(img);
});
