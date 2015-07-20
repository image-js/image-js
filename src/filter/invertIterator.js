// this code gives the same result as invert()
// but is based on a matrix of pixels
// may be easier to implement some algorithm
// but it will likely be much slower

export default function invertIterator() {
    this.checkProcessable('invert', {
        bitDepth: [1, 8, 16]
    });

    if (this.bitDepth === 1) {
        // we simply invert all the integers value
        // there could be a small mistake if the number of points
        // is not a multiple of 8 but it is not important
        let data = this.data;
        for (let i = 0; i < data.length; i++) {
            data[i] = ~data[i];
        }
    } else {
        for (let {index, pixel} of this.pixels()) {
            for (let k = 0; k < this.components; k++) {
                this.setValue(index, k, this.maxValue - pixel[k]);
            }
        }
    }
}
