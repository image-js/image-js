
// returns the number of transparent

export default function countPixels({
    alpha
    } = {}) {
    this.checkProcessable('countPixels', {
        bitDepth: [8, 16],
        alpha: 1
    });

    let count=0;

    if (alpha===0 || alpha>0) {
        for (let i = this.components; i < this.data.length; i += this.channels) {
            if (this.data[i]===alpha) count++;
        }
        return count;
    }

    return 0;
}
