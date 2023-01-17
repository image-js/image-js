// @eslint-ignore
import { ImageColorModel, Image } from '../src/Image';
import { getHarrisScore } from '../src/featureMatching/getHarrisScore';

const fastRadius = 3;

// const image = testUtils.createGreyImage([
//   [0, 0, 0, 0, 0, 0, 0],
//   [0, 0, 0, 0, 0, 0, 0],
//   [0, 0, 0, 0, 0, 0, 0],
//   [255, 255, 255, 0, 0, 0, 0],
//   [0, 0, 0, 255, 0, 0, 0],
//   [0, 0, 0, 255, 0, 0, 0],
//   [0, 0, 0, 255, 0, 0, 0],
// ]);

const image = new Image(7, 7, { colorModel: ImageColorModel.GREY });

const origin = { row: fastRadius, column: fastRadius };

let result = getHarrisScore(image, origin);

console.log(result);
