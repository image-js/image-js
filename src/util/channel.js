import * as Model from '../image/model/model';

/**
 * Specify which channels should be processed
 * * undefined : we take all the channels but alpha
 * * number : this specific channel
 * * string : converted to a channel based on rgb, cmyk, hsl or hsv (one letter code)
 * * [number] : array of channels as numbers
 * * [string] : array of channels as one letter string
 * @typedef {undefined|number|string|Array<number>|Array<string>} SelectedChannels
 */

export function validateArrayOfChannels(image, options = {}) {
  let {
    channels,
    allowAlpha,  // are we allowing the selection of an alpha channel ?
    defaultAlpha // if no channels are selected should we take the alpha channel ?
  } = options;

  if (typeof allowAlpha !== 'boolean') {
    allowAlpha = true;
  }

  if (typeof channels === 'undefined') {
    return allChannels(image, defaultAlpha);
  } else {
    return validateChannels(image, channels, allowAlpha);
  }
}

function allChannels(image, defaultAlpha) {
  let length = defaultAlpha ? image.channels : image.components;
  let array = new Array(length);
  for (let i = 0; i < length; i++) {
    array[i] = i;
  }
  return array;
}

function validateChannels(image, channels, allowAlpha) {
  if (!Array.isArray(channels)) {
    channels = [channels];
  }
  for (let c = 0; c < channels.length; c++) {
    channels[c] = validateChannel(image, channels[c], allowAlpha);
  }
  return channels;
}


export function validateChannel(image, channel, allowAlpha = true) {
  if (channel === undefined) {
    throw new RangeError(`validateChannel : the channel has to be >=0 and <${image.channels}`);
  }

  if (typeof channel === 'string') {
    switch (image.colorModel) {
      case Model.GREY:
        break;
      case Model.RGB:
        if ('rgb'.includes(channel)) {
          switch (channel) {
            case 'r':
              channel = 0;
              break;
            case 'g':
              channel = 1;
              break;
            case 'b':
              channel = 2;
              break;
                        // no default
          }
        }
        break;
      case Model.HSL:
        if ('hsl'.includes(channel)) {
          switch (channel) {
            case 'h':
              channel = 0;
              break;
            case 's':
              channel = 1;
              break;
            case 'l':
              channel = 2;
              break;
                        // no default
          }
        }
        break;
      case Model.HSV:
        if ('hsv'.includes(channel)) {
          switch (channel) {
            case 'h':
              channel = 0;
              break;
            case 's':
              channel = 1;
              break;
            case 'v':
              channel = 2;
              break;
                        // no default
          }
        }
        break;
      case Model.CMYK:
        if ('cmyk'.includes(channel)) {
          switch (channel) {
            case 'c':
              channel = 0;
              break;
            case 'm':
              channel = 1;
              break;
            case 'y':
              channel = 2;
              break;
            case 'k':
              channel = 3;
              break;
                        // no default
          }
        }
        break;
      default:
        throw new Error(`Unexpected color model: ${image.colorModel}`);
    }

    if (channel === 'a') {
      if (!image.alpha) {
        throw new Error('validateChannel : the image does not contain alpha channel');
      }
      channel = image.components;
    }

    if (typeof channel === 'string') {
      throw new Error(`validateChannel : undefined channel: ${channel}`);
    }
  }

  if (channel >= image.channels) {
    throw new RangeError(`validateChannel : the channel has to be >=0 and <${image.channels}`);
  }

  if (!allowAlpha && channel >= image.components) {
    throw new RangeError('validateChannel : alpha channel may not be selected');
  }

  return channel;
}
