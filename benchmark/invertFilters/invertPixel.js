// this code gives the same result as invert()
// but is based on a matrix of pixels
// may be easier to implement some algorithm
// but it will likely be much slower

export default function invertPixel() {
  this.checkProcessable('invertPixel', {
    bitDepth: [8, 16]
  });


  for (let x = 0; x < this.width; x++) {
    for (let y = 0; y < this.height; y++) {
      let value = this.getPixelXY(x, y);
      for (let k = 0; k < this.components; k++) {
        value[k] = this.maxValue - value[k];
      }
      this.setPixelXY(x, y, value);
    }
  }

}
