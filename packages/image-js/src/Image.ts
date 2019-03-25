import { BaseImage } from "@image-js/core";
import { invert } from '@image-js/filter';

export class Image extends BaseImage {
  public invert(): Image {
    return invert(this);
  }
}
