import * as Model from '../image/model/model';


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
        throw new RangeError('validateChannel : the channel has to be >=0 and <' + image.channels);
    }

    if (typeof channel === 'string') {
        switch (image.colorModel) {
            case Model.RGB:
                if ('rgb'.indexOf(channel) > -1) {
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
                    }
                }
                break;
            case Model.HSL:
                if ('hsl'.indexOf(channel) > -1) {
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
                    }
                }
                break;
            case Model.HSV:
                if ('hsv'.indexOf(channel) > -1) {
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
                    }
                }
                break;
            case Model.CMYK:
                if ('hsl'.indexOf(channel) > -1) {
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
                    }
                }
                break;
        }

        if (channel === 'a') {
            if (!image.alpha) {
                throw new Error('validateChannel : the image does not contain alpha channel');
            }
            channel = image.components;
        }

        if (typeof channel === 'string') {
            throw new Error('validateChannel : undefined channel: ' + channel);
        }
    }

    if (channel >= image.channels) {
        throw new RangeError('validateChannel : the channel has to be >=0 and <' + image.channels);
    }

    if (!allowAlpha && channel >= image.components) {
        throw new RangeError('validateChannel : alpha channel may not be selected');
    }

    return channel;
}
