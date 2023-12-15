import { TestImagePath } from '../../../../test/TestImagePath';
import { decodeStack } from '../decodeStack';

test.each([
  {
    name: 'formats/tif/grey8-multi.tif',
    colorModel: 'GREY',
    bitDepth: 8,
    pages: 2,
  },
  {
    name: 'formats/tif/grey16-multi.tif',
    colorModel: 'GREY',
    bitDepth: 16,
    pages: 2,
  },
  {
    name: 'formats/tif/color8-multi.tif',
    colorModel: 'RGB',
    bitDepth: 8,
    pages: 2,
  },
  {
    name: 'formats/tif/color16-multi.tif',
    colorModel: 'RGB',
    bitDepth: 16,
    pages: 2,
  },
])('stacks with 2 images ($colorModel, bitDepth = $bitDepth)', (data) => {
  const buffer = testUtils.loadBuffer(data.name as TestImagePath);
  const stack = decodeStack(buffer);
  expect(stack.size).toBe(data.pages);
  for (const image of stack) {
    expect(image.colorModel).toBe(data.colorModel);
    expect(image.bitDepth).toBe(data.bitDepth);
  }
});

test('invalid data format', () => {
  const buffer = testUtils.loadBuffer('formats/grey8.png');
  expect(() => decodeStack(buffer)).toThrow('invalid data format: image/png');
});
