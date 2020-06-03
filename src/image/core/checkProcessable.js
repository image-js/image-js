/**
 * This method checks if a process can be applied on the current image
 * @memberof Image
 * @instance
 * @param {string} processName
 * @param {object} [options]
 */
export default function checkProcessable(processName, options = {}) {
  let { bitDepth, alpha, colorModel, components, channels } = options;
  if (typeof processName !== 'string' || processName.length === 0) {
    throw new TypeError('processName must be a string');
  }
  if (bitDepth) {
    if (!Array.isArray(bitDepth)) {
      bitDepth = [bitDepth];
    }
    if (!bitDepth.includes(this.bitDepth)) {
      throw new TypeError(
        `The process: ${processName} can only be applied if bit depth is in: ${bitDepth}`,
      );
    }
  }
  if (alpha) {
    if (!Array.isArray(alpha)) {
      alpha = [alpha];
    }
    if (!alpha.includes(this.alpha)) {
      throw new TypeError(
        `The process: ${processName} can only be applied if alpha is in: ${alpha}`,
      );
    }
  }
  if (colorModel) {
    if (!Array.isArray(colorModel)) {
      colorModel = [colorModel];
    }
    if (!colorModel.includes(this.colorModel)) {
      throw new TypeError(
        `The process: ${processName} can only be applied if color model is in: ${colorModel}`,
      );
    }
  }
  if (components) {
    if (!Array.isArray(components)) {
      components = [components];
    }
    if (!components.includes(this.components)) {
      let errorMessage = `The process: ${processName} can only be applied if the number of components is in: ${components}`;
      if (components.length === 1 && components[0] === 1) {
        throw new TypeError(
          `${errorMessage}.\rYou should transform your image using "image.grey()" before applying the algorithm.`,
        );
      } else {
        throw new TypeError(errorMessage);
      }
    }
  }
  if (channels) {
    if (!Array.isArray(channels)) {
      channels = [channels];
    }
    if (!channels.includes(this.channels)) {
      throw new TypeError(
        `The process: ${processName} can only be applied if the number of channels is in: ${channels}`,
      );
    }
  }
}
