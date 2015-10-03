import validateArrayOfChannels from '../utility/validateArrayOfChannels';
import Image from '../image';

export default function hypot(otherImage, {bitDepth, channels} = {}) {
    this.checkProcessable('hypot', {
        bitDepth: [8, 16, 64]
    });
    if (this.width !== otherImage.width || this.height !== otherImage.height) {
        throw new Error('hypot: both images must have the same size');
    }
    if (this.alpha !== otherImage.alpha || this.bitDepth !== otherImage.bitDepth) {
        throw new Error('hypot: both images must have the same alpha and bitDepth');
    }
    if (this.channels !== otherImage.channels) {
        throw new Error('hypot: both images must have the same number of channels');
    }

    let newImage = Image.createFrom(this, {bitDepth:bitDepth});

    channels = validateArrayOfChannels(this, {channels:channels});

    let clamped = (newImage.bitDepth <= 32) ? true : false;

    for (let j = 0; j < channels.length; j++) {
        let c = channels[j];
        for (let i = c; i < this.data.length; i += this.channels) {
            let value = Math.sqrt(this.data[i] * this.data[i] + otherImage.data[i] * otherImage.data[i]);
            if (clamped) { // we calculate the clamped result
                newImage.data[i] = Math.min(Math.max(Math.round(value),0),newImage.maxValue);
            } else {
                newImage.data[i] = value;
            }
        }
    }

    return newImage;
}
