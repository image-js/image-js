export default function invertOneLoop() {
  this.checkProcessable('invertOneLoop', {
    bitDepth: [8, 16],
  });

  let data = this.data;
  for (let i = 0; i < data.length; i += this.channels) {
    for (let j = 0; j < this.components; j++) {
      data[i + j] = this.maxValue - data[i + j];
    }
  }
}
