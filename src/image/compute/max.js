import newArray from 'new-array';

// returns an array with the maximal value of each channel

export default function max() {
    this.checkProcessable('max', {
        bitDepth: [8, 16]
    });

    let result = newArray(this.channels,-Infinity);

    for (let i = 0; i < this.data.length; i += this.channels) {
        for (let c=0; c<this.channels; c++) {
            if (this.data[i+c]>result[c]) result[c]=this.data[i+c];
        }
    }
    return result;

}
