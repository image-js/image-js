import { writeSync } from '../../src/save/write';
import { getAffineTransform } from '../../src/featureMatching/affineTransfrom/getAffineTransform';
import { overlapImages } from '../../src/featureMatching/visualize/overlapImages';
import { readSync } from '../../src/load/read';
import { readdirSync, unlinkSync } from 'fs';
import { join } from 'path';

// global variables
const emptyFolder = false;

const margin = 20; // number of pixels to add around the reference ROI

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

const imageNames = ['img1'];
const roiIndices = [0, 1];

// empy results folder
if (emptyFolder) {
  const path = join(__dirname, 'results');
  for (const file of readdirSync(path)) {
    unlinkSync(join(path, file));
  }
}

// load images
const reference = readSync(__dirname + '/images/reference.png');
const images = imageNames.map((name) =>
  readSync(__dirname + '/images/' + name + '.png'),
);

console.log(images);

for (let roiIndex of roiIndices) {
  const roi = rois[roiIndex];
  const roiCounter = roiIndex + 1;
  const croppedRef = reference.crop({
    origin: { column: roi.x - margin, row: roi.y - margin },
    width: roi.width + margin,
    height: roi.height + margin,
  });
  writeSync(
    __dirname + '/results/reference_roi' + roiCounter + '.png',
    croppedRef,
  );
  for (let imageIndex = 0; imageIndex < images.length; imageIndex++) {
    const image = images[imageIndex];
    const imageCounter =
      imageNames[imageIndex][imageNames[imageIndex].length - 1];
    const cropped = image.crop({
      origin: { column: roi.x, row: roi.y },
      width: roi.width,
      height: roi.height,
    });
    writeSync(
      __dirname + '/results/img' + imageCounter + '_roi' + roiCounter + '.png',
      cropped,
    );

    const result = getAffineTransform(cropped, croppedRef, {
      debug: true,
      debugImagePath:
        __dirname +
        '/results/debug' +
        imageCounter +
        '_roi' +
        roiCounter +
        '.png',
      checkLimits: false,
      maxRansacNbIterations: 1000,
      crosscheck: false,
      destinationOrigin: { row: margin, column: margin },
    });

    const transform = result.transform;
    console.log(result);

    const overlapped = overlapImages(cropped, croppedRef, {
      origin: transform.translation,
      angle: -transform.rotation,
      scale: transform.scale,
    });

    writeSync(
      __dirname +
        '/results/img' +
        imageCounter +
        '_aligned_roi' +
        roiCounter +
        '.png',
      overlapped,
    );
  }
}
