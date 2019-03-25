import { BaseImage } from "./BaseImage";

/**
 * Create a new image base on the properties of an existing one.
 * @param other - Reference image.
 */
export function createFrom<T extends BaseImage>(other: T): T {
  const ImageConstructor = other.constructor as any;
  return new ImageConstructor(other.width, other.height, {
    bitDepth: other.bitDepth,
    kind: other.kind
  });
}
