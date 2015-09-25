
// returns the number of transparent

export default function countAlphaPixels({
    alpha
    } = {}) {
    this.checkProcessable('countAlphaPixels', {
        bitDepth: [8, 16],
        alpha: 1
    });

    let count = 0;

    if (alpha !== undefined) {
        for (let i = this.components; i < this.data.length; i += this.channels) {
            if (this.data[i] === alpha) count++;
        }
        return count;
    } else {
        // because there is an alpha channel all the pixels have an alpha
        return this.size;
    }
}
