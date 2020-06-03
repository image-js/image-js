import Image from '../Image';

/**
 * Extracts a part of an original image based on a mask. By default the mask may contain
 * a relative position and this part of the original image will be extracted.
 * @memberof Image
 * @instance
 * @param {Image} mask - Image containing a binary mask
 * @param {object} [options]
 * @param {number[]} [options.position] - Array of 2 elements to force the x,y coordinates
 * @return {Image} A new image
 */
export default function extract(mask, options = {}) {
  let { position } = options;
  this.checkProcessable('extract', {
    bitDepth: [1, 8, 16],
  });

  // we need to find the relative position to the parent
  if (!position) {
    position = mask.getRelativePosition(this);
    if (!position) {
      throw new Error(
        'extract : can not extract an image because the relative position can not be ' +
          'determined, try to specify manually the position as an array of 2 elements [x,y].',
      );
    }
  }

  if (this.bitDepth > 1) {
    let extract = Image.createFrom(this, {
      width: mask.width,
      height: mask.height,
      alpha: 1, // we force the alpha, otherwise difficult to extract a mask ...
      position: position,
      parent: this,
    });

    for (let x = 0; x < mask.width; x++) {
      for (let y = 0; y < mask.height; y++) {
        // we copy the point
        for (let channel = 0; channel < this.channels; channel++) {
          let value = this.getValueXY(
            x + position[0],
            y + position[1],
            channel,
          );
          extract.setValueXY(x, y, channel, value);
        }
        // we make it transparent in case it is not in the mask
        if (!mask.getBitXY(x, y)) {
          extract.setValueXY(x, y, this.components, 0);
        }
      }
    }

    return extract;
  } else {
    let extract = Image.createFrom(this, {
      width: mask.width,
      height: mask.height,
      position: position,
      parent: this,
    });
    for (let y = 0; y < mask.height; y++) {
      for (let x = 0; x < mask.width; x++) {
        if (mask.getBitXY(x, y)) {
          if (this.getBitXY(x + position[0], y + position[1])) {
            extract.setBitXY(x, y);
          }
        }
      }
    }

    return extract;
  }
}
