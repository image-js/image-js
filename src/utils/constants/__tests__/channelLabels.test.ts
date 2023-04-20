import { Image } from '../../../Image';
import { channelLabels } from '../channelLabels';
import { ImageColorModel } from '../colorModels';

test.each([
  {
    message: 'grey',
    colorModel: ImageColorModel.GREY,
    expected: ['Grey'],
  },
  {
    message: 'greya',
    colorModel: ImageColorModel.GREYA,
    expected: ['Grey', 'Alpha'],
  },
  {
    message: 'rgb',
    colorModel: ImageColorModel.RGB,
    expected: ['Red', 'Green', 'Blue'],
  },
  {
    message: 'rgba',
    colorModel: ImageColorModel.RGBA,
    expected: ['Red', 'Green', 'Blue', 'Alpha'],
  },
  {
    message: 'binary',
    colorModel: ImageColorModel.BINARY,
    expected: ['Mask'],
  },
])('channelLabels for $message image', (data) => {
  expect(channelLabels[data.colorModel]).toStrictEqual(data.expected);
});

test('channelLabels through image colorModel', () => {
  const image = new Image(2, 2);
  expect(channelLabels[image.colorModel]).toStrictEqual([
    'Red',
    'Green',
    'Blue',
  ]);
});
