import { IJS, ImageOptions } from '../IJS';

export interface IOutOptions {
  /**
   * Image to use as the output.
   * The image must have compatible properties or the method will throw.
   */
  out?: IJS;
}

interface IOutInternalOptions {
  /**
   * Parameters that will be combined with the ones from
   * `thisImage`.
   */
  newParameters?: ImageOptions;
}

/**
 * Use this function to support getting the output image of an algorithm from
 * user-supplied options.
 * @param thisImage - Current image on which the algorithm is applied.
 * @param options - Options object received by the algorithm.
 * @param internalOptions - Some additional private options.
 */
export function getOutputImage(
  thisImage: IJS,
  options: IOutOptions = {},
  internalOptions: IOutInternalOptions = {},
): IJS {
  const { out } = options;
  const { newParameters } = internalOptions;
  if (out === undefined) {
    return IJS.createFrom(thisImage, newParameters);
  } else {
    if (!(out instanceof IJS)) {
      throw new TypeError('out must be an Image object');
    }
    const requirements: ImageOptions = Object.assign(
      {
        width: thisImage.width,
        height: thisImage.height,
        depth: thisImage.depth,
        colorModel: thisImage.colorModel,
      },
      newParameters,
    );
    type keys = keyof typeof requirements;
    for (const property in requirements) {
      const prop = property as keys;
      if (out[prop] !== requirements[prop]) {
        throw new RangeError(
          `cannot use out. Its ${property} property must be ${requirements[prop]}. Found ${out[prop]}`,
        );
      }
    }
    return out;
  }
}
