// those methods can only apply on binary images... but we will not lose time to check!
const bitMethods = {
  /**
     * Set a specific pixel using XY coordinates from a binary image (mask)
     * @memberof Image
     * @instance
     * @param {number} x - x coordinate (0 = left)
     * @param {number} y - y coordinate (0 = top)
     */
  setBitXY(x, y) {
    this.setBit(y * this.width + x);
  },

  /**
     * Clear (unset) a specific pixel using XY coordinates from a binary image (mask)
     * @memberof Image
     * @instance
     * @param {number} x - x coordinate (0 = left)
     * @param {number} y - y coordinate (0 = top)
     */
  clearBitXY(x, y) {
    this.clearBit(y * this.width + x);
  },

  /**
     * Toggle (invert) a specific pixel using XY coordinates from a binary image (mask)
     * @memberof Image
     * @instance
     * @param {number} x - x coordinate (0 = left)
     * @param {number} y - y coordinate (0 = top)
     */
  toggleBitXY(x, y) {
    this.toggleBit(y * this.width + x);
  },

  /**
     * Get the state of a specific pixel using XY coordinates from a binary image (mask)
     * @memberof Image
     * @instance
     * @param {number} x - x coordinate (0 = left)
     * @param {number} y - y coordinate (0 = top)
     * @return {number} 0: bit is unset, 1: bit is set
     */
  getBitXY(x, y) {
    return this.getBit(y * this.width + x);
  },

  /**
     * Set a specific pixel from a binary image (mask)
     *
     * @memberof Image
     * @instance
     * @param {number} pixel - the pixel number which correspond to x * image.width + y
     */
  setBit(pixel) {
    this.data[getSlot(pixel)] |= 1 << getShift(pixel);
  },

  /**
     * Clear (unset) a specific pixel from a binary image (mask)
     * @memberof Image
     * @instance
     * @param {number} pixel - the pixel number which correspond to x * image.width + y
     */
  clearBit(pixel) {
    this.data[getSlot(pixel)] &= ~(1 << getShift(pixel));
  },

  /**
     * Toggle (invert) a specific pixel from a binary image (mask)
     * @memberof Image
     * @instance
     * @param {number} pixel - the pixel number which correspond to x * image.width + y
     */
  toggleBit(pixel) {
    this.data[getSlot(pixel)] ^= 1 << getShift(pixel);
  },

  /**
     * Get the state of a specific pixel using XY coordinates from a binary image (mask)
     * @memberof Image
     * @instance
     * @param {number} pixel - the pixel number which correspond to x * image.width + y
     * @return {number} 0: bit is unset, 1: bit is set
     */
  getBit(pixel) {
    return (this.data[getSlot(pixel)] & (1 << getShift(pixel))) ? 1 : 0;
  }
};

function getSlot(pixel) {
  return pixel >> 3;
}

function getShift(pixel) {
  return 7 - (pixel & 0b00000111);
}

export default function setBitMethods(Image) {
  for (const i in bitMethods) {
    Image.prototype[i] = bitMethods[i];
  }
}
