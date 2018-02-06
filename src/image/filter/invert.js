import { validateArrayOfChannels } from '../../util/channel';

/**
 * Invert the colors of an image
 * @memberof Image
 * @instance
 * @param {object} [options]
 * @param {SelectedChannels} [options.channels=undefined]
 * @return {Image}
 */
export default function invert(options = {}) {
  let { channels } = options;

  this.checkProcessable('invert', {
    bitDepth: [1, 8, 16]
  });

  if (this.bitDepth === 1) {
    invertBinary(this);
  } else {
    invertColor(this, channels);
  }
  return this;
}

function invertBinary(image) {
  const data = image.data;
  for (let i = 0; i < data.length; i++) {
    data[i] = ~data[i];
  }
}

function invertColor(image, channels) {
  channels = validateArrayOfChannels(image, { channels });
  for (let c = 0; c < channels.length; c++) {
    let j = channels[c];
    for (let i = j; i < image.data.length; i += image.channels) {
      image.data[i] = image.maxValue - image.data[i];
    }
  }
}
