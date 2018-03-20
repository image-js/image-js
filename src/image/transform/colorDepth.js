import Image from '../Image';

/**
 * Change the image color depth.
 * The color depth is the number of bits that is assigned to each point of a channel.
 * For normal images it is 8 bits meaning the value is between 0 and 255.
 * Currently only conversion from 1, 8 or 16 bits towards 8 or 16 bits are allowed.
 * @memberof Image
 * @instance
 * @param {number} [newColorDepth=8]
 * @return {Image} The new image
 * @example
 * var newImage = image.colorDepth(8);
 */
export default function colorDepth(newColorDepth = 8) {
  this.checkProcessable('colorDepth', {
    bitDepth: [1, 8, 16]
  });

  if (![8, 16].includes(newColorDepth)) {
    throw Error('You need to specify the new colorDepth as 8 or 16');
  }

  if (this.bitDepth === newColorDepth) {
    return this.clone();
  }

  let newImage = Image.createFrom(this, { bitDepth: newColorDepth });

  switch (newColorDepth) {
    case 8:
      if (this.bitDepth === 1) {
        for (let i = 0; i < this.size; i++) {
          if (this.getBit(i)) {
            newImage.data[i] = 255;
          }
        }
      } else {
        for (let i = 0; i < this.data.length; i++) {
          newImage.data[i] = this.data[i] >> 8;
        }
      }
      break;
    case 16:
      if (this.bitDepth === 1) {
        for (let i = 0; i < this.size; i++) {
          if (this.getBit(i)) {
            newImage.data[i] = 65535;
          }
        }
      } else {
        for (let i = 0; i < this.data.length; i++) {
          newImage.data[i] = this.data[i] << 8 | this.data[i];
        }
      }
      break;
    default:
      throw new Error('colorDepth conversion unexpected case');
  }
  return newImage;
}
