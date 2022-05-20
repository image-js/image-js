import { IJS } from '../IJS';
import checkProcessable from '../utils/checkProcessable';
import { getClamp } from '../utils/clamp';
import { getOutputImage } from '../utils/getOutputImage';
import { validateChannels } from '../utils/validators';

export interface LevelOptions {
  /**
   * Specify which channels should be processed. To process the alpha as well,
   * specify the channels as [0,1,2,3] for RGBA images and [0,1] for GREYA.
   *
   * @default All components of the image the image (no alpha).
   */
  channels?: number[];
  /**
   * Minimal input value.
   *
   * @default image.minValue
   */
  inputMin?: number;
  /**
   * Maximal input value.
   *
   * @default image.minValue
   */
  inputMax?: number;
  /**
   * Minimal output value.
   *
   * @default image.minValue
   */
  outputMin?: number;
  /**
   * Maximal output value.
   *
   * @default image.minValue
   */
  outputMax?: number;
  /**
   * Specifies the shape of the curve connecting the two points.
   *
   * @default 1
   */
  gamma?: number;
  /**
   * Image to which to output.
   */
  out?: IJS;
}

/**
 * Level the image using the optional input and output value. This function allows you to enhance the image's contrast.
 *
 * @param image - Image to process.
 * @param options - Level options.
 * @returns The levelled image.
 */
export function level(image: IJS, options: LevelOptions = {}) {
  let {
    inputMin = 0,
    inputMax = image.maxValue,
    outputMin = 0,
    outputMax = image.maxValue,
    gamma = 1,
    channels = new Array(image.components).fill(0).map((value, index) => index),
  } = options;

  validateChannels(channels, image);

  checkProcessable(image, 'level', {
    bitDepth: [8, 16],
  });

  let newImage = getOutputImage(image, options, { clone: true });

  const clamp = getClamp(image);

  for (let row = 0; row < image.height; row++) {
    for (let column = 0; column < image.width; column++) {
      for (let channel of channels) {
        let currentValue = image.getValue(column, row, channel);

        let clamped = Math.max(Math.min(currentValue, inputMax), inputMin);

        const ratio = clamp((clamped - inputMin) / (inputMax - inputMin));

        const result = clamp(
          ratio ** (1 / gamma) * (outputMax - outputMin) + outputMin,
        );

        newImage.setValue(column, row, channel, result);
      }
    }
  }
  return newImage;
}
