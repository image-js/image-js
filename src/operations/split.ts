import { IJS, ImageColorModel } from '../IJS';

/**
 * Create an array of single -channel images based on a multi-channel image.
 *
 * @param image - The image with many channels.
 * @returns Array of single-channel images.
 */
export function split(image: IJS): IJS[] {
  const result = [];
  for (let c = 0; c < image.channels; c++) {
    const channel = IJS.createFrom(image, { colorModel: ImageColorModel.GREY });
    for (let i = 0; i < channel.size; i++) {
      channel.setValueByIndex(i, 0, image.getValueByIndex(i, c));
    }
    result.push(channel);
  }
  return result;
}
