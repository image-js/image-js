// this code gives the same result as invert()
// but is based on a matrix of pixels
// may be easier to implement some algorithm
// but it will likely be much slower

// this method is 50 times SLOWER than invert !!!!!!

export default function invertApplyAll() {

    this.checkProcessable('invertApplyAll', {
        bitDepth: [8, 16]
    });
    this.applyAll(function (index) {
        for (let k = 0; k < this.components; k++) {
            this.data[index + k] = this.maxValue - this.data[index + k];
        }
    });

}
