import { BaseImage } from "@image-js/core";
import { invert } from '@image-js/filter';

export class Image extends BaseImage {
  /**
   * Invert the colors of the image.
   */
  public invert(): Image {
    return invert(this);
  }
}
