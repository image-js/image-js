import { writeSync } from '../../src/save/write';
import { getAffineTransform } from '../../src/featureMatching/affineTransfrom/getAffineTransform';
import { overlapImages } from '../../src/featureMatching/visualize/overlapImages';
import { readSync } from '../../src/load/read';

const rois = [
  {
    x: 556,
    y: 81,
    width: 1070,
    height: 163,
  },
  {
    x: 903,
    y: 1074,
    width: 386,
    height: 169,
  },
];

// load images
const imageNames = ['img1'];

const reference = readSync(__dirname + '/images/reference.png');
const images = imageNames.map((name) =>
  readSync(__dirname + '/images/' + name + '.png'),
);

console.log(images);

let imageCounter = 0;
for (let image of images) {
  imageCounter++;
  let roiCounter = 0;
  for (let roi of rois) {
    roiCounter++;
    const cropped = image.crop({
      origin: { column: roi.x, row: roi.y },
      width: roi.width,
      height: roi.height,
    });
    writeSync(
      __dirname +
        '/results/img' +
        imageCounter +
        '_roi' +
        roiCounter +
        '_cropped.png',
      cropped,
    );

    const result = getAffineTransform(cropped, reference, {
      debug: true,
      debugImageName: 'debug' + imageCounter + '_roi' + roiCounter,
    });

    const transform = result.transform;
    console.log(result);

    const overlapped = overlapImages(cropped, reference, {
      origin: transform.translation,
      angle: transform.rotation,
      scale: transform.scale,
    });

    writeSync(
      __dirname + '/results/img' + imageCounter + '_roi' + roiCounter + '.png',
      overlapped,
    );
  }
}
