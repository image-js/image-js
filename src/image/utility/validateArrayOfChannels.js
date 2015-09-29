import validateChannel from './validateChannel';

export default function arrayOfChannels(image, {
    channels,
    allowAlpha,  // are we allowing the selection of an alpha channel ?
    defaultAlpha // if no channels are selected should we take the alpha channel ?
    } = {}) {

    if (typeof allowAlpha !== 'boolean') allowAlpha = true;

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
    if (!Array.isArray(channels)) channels = [channels];
    for (let c = 0; c < channels.length; c++) {
        channels[c] = validateChannel(image,channels[c], allowAlpha);
    }
    return channels;
}
