import { ColorDepth } from '..';
import { CreateFromOptions, IJS, ImageColorModel } from '../IJS';
import { Mask } from '../Mask';

export interface ImageOutOptions {
  /**
   * Image to use as the output.
   * The image must have compatible properties or the method will throw.
   */
  out?: IJS;
}
export interface MaskOutOptions {
  /**
   * Image to use as the output.
   * The image must have compatible properties or the method will throw.
   */
  out?: Mask;
}

type NewImageParameters = Omit<CreateFromOptions, 'data'>;

interface OutInternalOptions {
  /**
   * Parameters that will be combined with the ones from
   * `thisImage`.
   */
  newParameters?: NewImageParameters;
  clone?: boolean;
}

/**
 * Use this function to support getting the output image of an algorithm from
 * user-supplied options.
 *
 * @param thisImage - Current image on which the algorithm is applied.
 * @param options - Options object received by the algorithm.
 * @param internalOptions - Some additional private options.
 * @returns The output image.
 */
export function getOutputImage(
  thisImage: IJS,
  options: ImageOutOptions = {},
  internalOptions: OutInternalOptions = {},
): IJS {
  const { out } = options;
  const { newParameters, clone } = internalOptions;
  if (out === undefined) {
    if (clone) {
      return thisImage.clone();
    } else {
      return IJS.createFrom(thisImage, newParameters);
    }
  } else {
    if (!(out instanceof IJS)) {
      throw new TypeError('out must be an IJS object');
    }
    const requirements: NewImageParameters = Object.assign(
      {
        width: thisImage.width,
        height: thisImage.height,
        depth: thisImage.depth,
        colorModel: thisImage.colorModel,
      },
      newParameters,
    );
    checkRequirements(requirements, out);
    return out;
  }
}

/**
 * Use this function to support getting the output image of an algorithm from
 * user-supplied options when the input is a mask.
 *
 * @param mask - Current mask on which the algorithm is applied.
 * @param options - Options object received by the algorithm.
 * @returns The output image.
 */
export function maskToOutputImage(
  mask: Mask,
  options: ImageOutOptions = {},
): IJS {
  const { out } = options;
  if (out === undefined) {
    return IJS.createFrom(mask, { colorModel: ImageColorModel.GREY });
  } else {
    if (!(out instanceof IJS)) {
      throw new TypeError('out must be an IJS object');
    }
    const requirements: NewImageParameters = {
      width: mask.width,
      height: mask.height,
      depth: ColorDepth.UINT8,
      colorModel: ImageColorModel.GREY,
    };
    checkRequirements(requirements, out);
    return out;
  }
}

/**
 * Use this function to support getting the output image of an algorithm from
 * user-supplied options when the input is a mask.
 *
 * @param image - Current mask on which the algorithm is applied.
 * @param options - Options object received by the algorithm.
 * @returns The output image.
 */
export function imageToOutputMask(
  image: IJS,
  options: MaskOutOptions = {},
): Mask {
  const { out } = options;
  if (out === undefined) {
    return Mask.createFrom(image);
  } else {
    if (!(out instanceof Mask)) {
      throw new TypeError('out must be a Mask object');
    }
    const requirements: NewImageParameters = {
      width: image.width,
      height: image.height,
      depth: ColorDepth.UINT1,
      colorModel: ImageColorModel.BINARY,
    };
    checkRequirements(requirements, out);
    return out;
  }
}

function checkRequirements<ReqType extends object, OutType extends ReqType>(
  requirements: ReqType,
  out: OutType,
): void {
  type Keys = keyof ReqType;
  for (const property in requirements) {
    const prop = property as Keys;
    if (out[prop] !== requirements[prop]) {
      throw new RangeError(
        `cannot use out. Its ${property} property must be ${requirements[prop]}. Found ${out[prop]}`,
      );
    }
  }
}
