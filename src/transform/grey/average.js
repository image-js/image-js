export default function average(newImage) {
    let ptr = 0;
    for (let i = 0; i < this.data.length; i += this.channels) {
        newImage.data[ptr++] = (this.data[i] + this.data[i + 1] + this.data[i + 2]) / 3;
        if (this.alpha) {
            newImage.data[ptr++] = this.data[i + 3];
        }
    }
}
