import Image from '../image';
import validateArrayOfChannels from './validateArrayOfChannels';
import newArray from 'new-array';

// Try to match the current pictures with another one

// if normalize we normalize separately the 2 images

export default function overlap( image, {shift=[0,0], average, channels, defaultAlpha, normalize}={} ) {

    this.checkProcessable('overlap', {
        bitDepth: [8, 16]
    });

    channels = validateArrayOfChannels(this, {channels:channels, defaultAlpha:defaultAlpha});

    if (this.bitDepth!==image.bitDepth) {
        throw new Error('Both images must have the same bitDepth');
    }
    if (this.channels!==image.channels) {
        throw new Error('Both images must have the same number of channels');
    }
    if (this.colorModel!==image.colorModel) {
        throw new Error('Both images must have the same colorModel');
    }

    if (typeof average==='undefined') average=true;

    // we allow a shift
    // we need to find the minX, maxX, minY, maxY
    let minX=Math.max(0, -shift[0]);
    let maxX=Math.min(this.width, this.width-shift[0]);
    let minY=Math.max(0, -shift[1]);
    let maxY=Math.min(this.height, this.height-shift[1]);

    let results=newArray(channels.length,0);
    for (let i=0; i<channels.length; i++) {
        let c=channels[i];
        let sumThis=normalize ? this.sum[c] : Math.max(this.sum[c], image.sum[c]);
        let sumImage=normalize ? image.sum[c] : Math.max(this.sum[c], image.sum[c]);

        if (sumThis!==0 && sumImage!==0) {
            for (let x=minX; x<maxX; x++) {
                for (let y=minY; y<maxY; y++) {
                    let indexThis=x*this.multipliers[0]+y*this.multipliers[1]+c;
                    let indexImage=indexThis+shift[0]*this.multipliers[0]+shift[1]*this.multipliers[1];
                    results[i]+=Math.min(this.data[indexThis]/sumThis, image.data[indexImage]/sumImage);
                }
            }
        }
    }

    if (average) {
        return results.reduce((sum, x) => sum + x)/results.length;
    }

    return results;
}
