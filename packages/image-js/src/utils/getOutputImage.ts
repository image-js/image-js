import { Image, INewImageOptions } from '../Image';

export interface IOutOptions {
  /**
   * Image to use as the output.
   * The image must have compatible properties or the method will throw.
   */
  out?: Image;
}

interface IOutInternalOptions {
  /**
   * If true, the original image will be copied instead of creating a new image.
   */
  copy?: boolean;
  /**
   * Parameters that will be combined with the ones from
   * thisImage`. This option is only used if `copy` is `false`.
   */
  newParameters?: INewImageOptions;
}

/**
 * Use this function to support getting the output image of an algorithm from
 * user-supplied options.
 * @private
 * @param thisImage - Current image on which the algorithm is applied.
 * @param options - Options object received by the algorithm.
 * @param internalOptions - Some additional private options.
 */
export function getOutputImage(
  thisImage: Image,
  options: IOutOptions = {},
  internalOptions: IOutInternalOptions = {}
): Image {
  const { out } = options;
  const { copy, newParameters } = internalOptions;
  if (out === undefined) {
    if (copy) {
      return thisImage.clone();
    } else {
      return Image.createFrom(thisImage, newParameters);
    }
  } else {
    if (!(out instanceof Image)) {
      throw new TypeError('out must be an Image object');
    }
    const requirements: INewImageOptions = Object.assign(
      {
        width: thisImage.width,
        height: thisImage.height,
        depth: thisImage.depth,
        kind: thisImage.kind
      },
      newParameters
    );
    type keys = keyof typeof requirements;
    for (const property in requirements) {
      const prop = property as keys;
      if (out[prop] !== requirements[prop]) {
        throw new RangeError(
          `cannot use out. Its ${property} property must be ${
            requirements[prop]
          }. Found ${out[prop]}`
        );
      }
    }
    return out;
  }
}
