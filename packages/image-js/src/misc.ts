import { Image, INewImageOptions } from './Image';

/**
 * Create a new image base on the properties of an existing one.
 * @param other - Reference image.
 */
export function createFrom(other: Image, options?: INewImageOptions): Image {
  return new Image({
    width: other.width,
    height: other.height,
    bitDepth: other.bitDepth,
    kind: other.kind,
    ...options
  });
}
