import { DerivativeFilters, IJS, ImageColorModel } from '../../../src';
// options
const cropImageRatio = 2; // defines the size of the cropped image
const interval = 2; // defines the speed

// variables
let column = 0;
let row = 0;

let columnInterval: number;
let rowInterval: number;

export function testCropBounce(image: IJS): IJS {
  const width = Math.floor(image.width / cropImageRatio);
  const height = Math.floor(image.height / cropImageRatio);

  if (image.width - width - column <= interval) {
    columnInterval = -interval;
  } else if (column <= interval) {
    columnInterval = interval;
  }

  if (image.height - height - row <= interval) {
    rowInterval = -interval;
  } else if (row <= interval) {
    rowInterval = interval;
  }

  column += columnInterval;
  row += rowInterval;

  const cropped = image.crop({
    column,
    row,
    width,
    height,
  });
  const grey = cropped.grey();
  const derivative = grey.derivativeFilter({
    filter: DerivativeFilters.PREWITT,
  });

  const rgba = derivative.convertColor(ImageColorModel.RGBA);

  return rgba.copyTo(image, { row, column });
}
