import * as Model from '../model/model';

export default function validateChannel(image, channel) {
    if (channel===undefined) {
        throw new RangeError('validateChannel : the channel has to be >=0 and <'+image.channels);
    }

    if (typeof channel === 'string') {
        if (image.colorModel!==Model.RGB) throw new Error('getChannel : not a RGB image');
        switch (channel) {
            case 'r':
                return 0;
            case 'g':
                return 1;
            case 'b':
                return 2;
            case 'a':
                if (! image.alpha) throw new Error('validateChannel : the image does not contain alpha channel');
                return 3;
            default:
                throw new Error('validateChannel : undefined channel: '+channel);
        }
    }

    if (channel>=image.channels) {
        throw new RangeError('validateChannel : the channel has to be >=0 and <'+image.channels);
    }

    return channel;

}