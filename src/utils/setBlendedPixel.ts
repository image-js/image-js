import { IJS } from '../IJS';

import { getDefaultColor } from './getDefaultColor';

export interface SetBlendedPixelOptions {
  /**
   * Color with which to blend the image pixel.
   *
   * @default Opaque black.
   */
  color?: number[];
}

/**
 * Blend the given pixel with the pixel at the specified location in the image.
 *
 * @param image - The image with which to blend.
 * @param column - Column of the target pixel.
 * @param row - Row of the target pixel.
 * @param options - Set blended pixel options.
 */
export function setBlendedPixel(
  image: IJS,
  column: number,
  row: number,
  options: SetBlendedPixelOptions = {},
) {
  const { color = getDefaultColor(image) } = options;

  if (!image.alpha) {
    image.setPixel(column, row, color);
    return;
  } else {
    const sourceAlpha = color[color.length - 1];

    if (sourceAlpha === image.maxValue) {
      image.setPixel(column, row, color);
      return;
    }

    const targetAlpha = image.getValue(column, row, image.channels - 1);

    let newAlpha =
      sourceAlpha + targetAlpha * (1 - sourceAlpha / image.maxValue);

    image.setValue(column, row, image.channels - 1, newAlpha);

    for (let component = 0; component < image.components; component++) {
      let sourceComponent = color[component];
      let targetComponent = image.getValue(column, row, component);

      let newComponent =
        (sourceComponent * sourceAlpha +
          targetComponent * targetAlpha * (1 - sourceAlpha / image.maxValue)) /
        newAlpha;

      image.setValue(column, row, component, newComponent);
    }
  }
}
