export default function invert() {
  this.checkProcessable('invert', {
    bitDepth: [1, 8, 16],
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
    for (let x = 0; x < this.width; x++) {
      for (let y = 0; y < this.height; y++) {
        for (let k = 0; k < this.components; k++) {
          let value = this.getValueXY(x, y, k);
          this.setValueXY(x, y, k, this.maxValue - value);
        }
      }
    }
  }
}
