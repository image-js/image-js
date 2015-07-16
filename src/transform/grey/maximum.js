export default function maximum(newImage) {
    let ptr = 0;
    for (let i = 0; i < this.data.length; i += this.channels) {
        newImage.data[ptr++] = Math.max(this.data[i], this.data[i + 1], this.data[i + 2]);
        if (this.alpha) {
            newImage.data[ptr++] = this.data[i + 3];
        }
    }
}
