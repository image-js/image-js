import {
  convertBinaryToGrey,
  DerivativeFilters,
  IJS,
  ImageColorModel,
} from '../../src';

export function testCopyTo(image: IJS): IJS {
  let result = image.copyTo(image, {
    rowOffset: image.height / 2,
    columnOffset: image.width / 2,
  });
  let blackSquare = new IJS(50, 50, { colorModel: ImageColorModel.RGBA });
  let redSquare = new IJS(150, 150, { colorModel: ImageColorModel.RGBA });
  redSquare.fillChannel(0, 255);
  redSquare.fillAlpha(100);
  result = blackSquare.copyTo(result, {
    rowOffset: 200,
    columnOffset: 300,
  });
  redSquare.copyTo(result, {
    columnOffset: ((Date.now() / 10) >>> 0) % 500,
    rowOffset: ((Date.now() / 10) >>> 0) % 500,
    out: result,
  });
  return result;
}

export function testCannyEdge(image: IJS): IJS {
  let result = image.convertColor(ImageColorModel.GREY);
  result = result.gaussianBlur({ size: 7, sigma: 4 });
  const edges = result.cannyEdgeDetector({
    lowThreshold: 0.08,
    highThreshold: 0.1,
  });
  convertBinaryToGrey(edges, result);
  return result;
}
export function testCannyEdgeOverlay(image: IJS): IJS {
  let result = image.convertColor(ImageColorModel.GREY);
  const edges = result.cannyEdgeDetector({
    lowThreshold: 0.08,
    highThreshold: 0.1,
  });
  let greyEdges = edges.convertColor(ImageColorModel.GREY);
  greyEdges = greyEdges.convertColor(ImageColorModel.RGBA);
  greyEdges = greyEdges.invert();
  for (let row = 0; row < image.height; row++) {
    for (let column = 0; column < image.width; column++) {
      if (greyEdges.getValue(row, column, 0) === greyEdges.maxValue) {
        greyEdges.setValue(row, column, 3, 0);
      }
    }
  }
  result = greyEdges.copyTo(image);
  return result;
}

export function testDerivativeFilter(image: IJS): IJS {
  image = image.convertColor(ImageColorModel.GREY);
  return image.derivativeFilter({ filter: DerivativeFilters.PREWITT });
}
