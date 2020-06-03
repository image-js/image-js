import Image from '../Image';

/**
 * Make a copy of the current image and convert to RGBA 8 bits
 * Those images are the one that are displayed in a canvas.
 * RGB model in 8 bits per channel and containing as well an alpha channel.
 * The source image may be:
 * * a mask (binary image)
 * * a grey image (8, 16 or 32 bits) with or without alpha channel
 * * a color image (8, 16 or 32 bits) with or without alpha channel in with RGB model
 * * when the image is 32 bits, a rescaling is performed from the min and max values
 * * to map values from 0 to 255
 * The conversion is based on {@link Image#getRGBAData}.
 * @memberof Image
 * @instance
 * @return {Image} - New image in RGB color model with alpha channel
 * @example
 * var rgbaImage = image.rgba8();
 */
export default function rgba8() {
  return new Image(this.width, this.height, this.getRGBAData(), {
    kind: 'RGBA',
    parent: this,
  });
}
