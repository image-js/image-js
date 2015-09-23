// those methods can only apply on binary images... but we will not lose time to check!
let bitMethods = {
    setBitXY(x, y) {
        let target = y * this.width + x;
        let shift = 7 - (target & 0b00000111);
        let slot = target >> 3;
        this.data[slot] |= 1 << shift;
    },

    clearBitXY(x, y) {
        let target = y * this.width + x;
        let shift = 7 - (target & 0b00000111);
        let slot = target >> 3;
        this.data[slot] &= ~(1 << shift);
    },

    toggleBitXY(x, y) {
        let target = y * this.width + x;
        let shift = 7 - (target & 0b00000111);
        let slot = target >> 3;
        this.data[slot] ^= 1 << shift;
    },

    getBitXY(x, y) {
        let target = y * this.width + x;
        let shift = 7 - (target & 0b00000111);
        let slot = target >> 3;
        return (this.data[slot] & 1 << shift) ? 1 : 0;
    },

    setBit(pixel) {
        let shift = 7 - (pixel & 0b00000111);
        let slot = pixel >> 3;
        this.data[slot] |= 1 << shift;
    },

    clearBit(pixel) {
        let shift = 7 - (pixel & 0b00000111);
        let slot = pixel >> 3;
        this.data[slot] &= ~(1 << shift);
    },

    toggleBit(pixel) {
        let shift = 7 - (pixel & 0b00000111);
        let slot = pixel >> 3;
        this.data[slot] ^= 1 << shift;
    },

    getBit(pixel) {
        let shift = 7 - (pixel & 0b00000111);
        let slot = pixel >> 3;
        return (this.data[slot] & 1 << shift) ? 1 : 0;
    }
};

export default function (Image) {
    for (let i in bitMethods) {
        Image.prototype[i] = bitMethods[i];
    }
}
