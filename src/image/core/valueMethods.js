const valueMethods = {
  /**
   * Get the value of specific pixel channel
   * @memberof Image
   * @instance
   * @param {number} x - x coordinate (0 = left)
   * @param {number} y - y coordinate (0 = top)
   * @param {number} channel
   * @return {number} - the value of this pixel channel
   */
  getValueXY(x, y, channel) {
    return this.data[(y * this.width + x) * this.channels + channel];
  },

  /**
   * Set the value of specific pixel channel
   * @memberof Image
   * @instance
   * @param {number} x - x coordinate (0 = left)
   * @param {number} y - y coordinate (0 = top)
   * @param {number} channel
   * @param {number} value - the new value of this pixel channel
   * @return {this}
   */
  setValueXY(x, y, channel, value) {
    this.data[(y * this.width + x) * this.channels + channel] = value;
    this.computed = null;
    return this;
  },

  /**
   * Get the value of specific pixel channel
   * @memberof Image
   * @instance
   * @param {number} index - 1D index of the pixel
   * @param {number} channel
   * @return {number} - the value of this pixel channel
   */
  getValue(index, channel) {
    return this.data[index * this.channels + channel];
  },

  /**
   * Set the value of specific pixel channel
   * @memberof Image
   * @instance
   * @param {number} index - 1D index of the pixel
   * @param {number} channel
   * @param {number} value - the new value of this pixel channel
   * @return {this}
   */
  setValue(index, channel, value) {
    this.data[index * this.channels + channel] = value;
    this.computed = null;
    return this;
  },

  /**
   * Get the value of an entire pixel
   * @memberof Image
   * @instance
   * @param {number} x - x coordinate (0 = left)
   * @param {number} y - y coordinate (0 = top)
   * @return {number[]} the value of this pixel
   */
  getPixelXY(x, y) {
    return this.getPixel(y * this.width + x);
  },

  /**
   * Set the value of an entire pixel
   * @memberof Image
   * @instance
   * @param {number} x - x coordinate (0 = left)
   * @param {number} y - y coordinate (0 = top)
   * @param {number[]} value - the new value of this pixel
   * @return {this}
   */
  setPixelXY(x, y, value) {
    return this.setPixel(y * this.width + x, value);
  },

  /**
   * Get the value of an entire pixel
   * @memberof Image
   * @instance
   * @param {number} index - 1D index of the pixel
   * @return {number[]} the value of this pixel
   */
  getPixel(index) {
    const value = new Array(this.channels);
    const target = index * this.channels;
    for (let i = 0; i < this.channels; i++) {
      value[i] = this.data[target + i];
    }
    return value;
  },

  /**
   * Set the value of an entire pixel
   * @memberof Image
   * @instance
   * @param {number} index - 1D index of the pixel
   * @param {number[]} value - the new value of this pixel
   * @return {this}
   */
  setPixel(index, value) {
    const target = index * this.channels;
    for (let i = 0; i < value.length; i++) {
      this.data[target + i] = value[i];
    }
    this.computed = null;
    return this;
  },
};

export default function setValueMethods(Image) {
  for (const i in valueMethods) {
    Image.prototype[i] = valueMethods[i];
  }
}
