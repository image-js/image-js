export default function invertBinaryLoop() {
    this.checkProcessable('invertBinaryLoop', {
        bitDepth: [1],
        dimension: 2
    });

    for (let i = 0; i < this.size; i++) {
        this.toggleBit(i);
    }
}
