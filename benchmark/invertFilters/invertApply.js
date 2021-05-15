// this code gives the same result as invert()
// but is based on a matrix of pixels
// may be easier to implement some algorithm
// but it will likely be much slower

// this method is 50 times SLOWER than invert !!!!!!

export default function invertApply() {
  if (this.bitDepth === 1) {
    // we simply invert all the integers value
    // there could be a small mistake if the number of points
    // is not a multiple of 8 but it is not important
    let data = this.data;
    for (let i = 0; i < data.length; i++) {
      data[i] = ~data[i];
    }
  } else {
    this.checkProcessable('invertApply', {
      bitDepth: [8, 16],
    });
    this.apply(function (index) {
      for (let k = 0; k < this.components; k++) {
        this.data[index + k] = this.maxValue - this.data[index + k];
      }
    });
  }
}
