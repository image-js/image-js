// Those methods can only be called on binary images, but we won't lose time to check.
const bitMethods = {
  /**
   * Get the bit of a pixel using a pixel index.
   * This method can only be called on binary images.
   * @memberof Image
   * @instance
   * @param {number} pixel - The pixel index which corresponds to `x * image.width + y`
   * @return {number} 0: bit is unset, 1: bit is set
   */
  getBit(pixel) {
    return this.data[getSlot(pixel)] & (1 << getShift(pixel)) ? 1 : 0;
  },

  /**
   * Set the bit of a pixel using a pixel index.
   * This method can only be called on binary images.
   * @memberof Image
   * @instance
   * @param {number} pixel - The pixel index which corresponds to `x * image.width + y`
   */
  setBit(pixel) {
    this.data[getSlot(pixel)] |= 1 << getShift(pixel);
  },

  /**
   * Clear the bit of a pixel using a pixel index.
   * This method can only be called on binary images.
   * @memberof Image
   * @instance
   * @param {number} pixel - The pixel index which corresponds to `x * image.width + y`
   */
  clearBit(pixel) {
    this.data[getSlot(pixel)] &= ~(1 << getShift(pixel));
  },

  /**
   * Toggle (invert) the bit of a pixel using a pixel index.
   * This method can only be called on binary images.
   * @memberof Image
   * @instance
   * @param {number} pixel - The pixel index which corresponds to `x * image.width + y`
   */
  toggleBit(pixel) {
    this.data[getSlot(pixel)] ^= 1 << getShift(pixel);
  },

  /**
   * Get the bit of a pixel using coordinates.
   * This method can only be called on binary images.
   * @memberof Image
   * @instance
   * @param {number} x - x coordinate (0 = left)
   * @param {number} y - y coordinate (0 = top)
   * @return {number} 0: bit is unset, 1: bit is set
   */
  getBitXY(x, y) {
    if (x >= this.width || y >= this.height) return 0;
    return this.getBit(y * this.width + x);
  },

  /**
   * Set the bit of a pixel using coordinates.
   * This method can only be called on binary images.
   * @memberof Image
   * @instance
   * @param {number} x - x coordinate (0 = left)
   * @param {number} y - y coordinate (0 = top)
   */
  setBitXY(x, y) {
    this.setBit(y * this.width + x);
  },

  /**
   * Clear the bit of a pixel using coordinates.
   * @memberof Image
   * @instance
   * @param {number} x - x coordinate (0 = left)
   * @param {number} y - y coordinate (0 = top)
   */
  clearBitXY(x, y) {
    this.clearBit(y * this.width + x);
  },

  /**
   * Toggle (invert) the bit of a pixel using coordinates.
   * @memberof Image
   * @instance
   * @param {number} x - x coordinate (0 = left)
   * @param {number} y - y coordinate (0 = top)
   */
  toggleBitXY(x, y) {
    this.toggleBit(y * this.width + x);
  },
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
