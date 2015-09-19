import validateChannel from './validateChannel';

export default function arrayOfChannels(image, channels, allowAlpha) {
    if (typeof channels !== 'undefined') {
        if (typeof channels === 'boolean') {
            allowAlpha=channels;
            return allChannels(image, allowAlpha);
        } else {
            return validateChannels(image, channels, allowAlpha);
        }
    } else {
        return allChannels(image, allowAlpha);
    }
}

function allChannels(image, allowAlpha) {
    if (typeof allowAlpha === 'undefined') allowAlpha=true;
    let length=allowAlpha ? image.channels : image.components;
    let array=new Array(length);
    for (let i=0; i<length; i++) {
        array[i]=i;
    }
    return array;
}

function validateChannels(image, channels, allowAlpha) {
    if (typeof allowAlpha === 'undefined') allowAlpha=true;
    if (! Array.isArray(channels)) channels=[channels];
    for (let c=0; c<channels.length; c++) {
        channels[c] = validateChannel(image,channels[c], allowAlpha);
    }
    return channels;
}