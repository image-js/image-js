import { writeSync } from '../../src/save/write';
import { overlapImages } from '../../src/featureMatching/visualize/overlapImages';
import { readSync } from '../../src/load/read';
import { readdirSync, unlinkSync } from 'fs';
import { join } from 'path';
import { getAffineTransform } from '../../src';

// global variables
const emptyFolder = true;

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

const imageNames = ['img1', 'img2', 'img3'];
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

// align images
for (let roiIndex of roiIndices) {
  const roi = rois[roiIndex];
  const roiCounter = roiIndex + 1;
  const croppedRef = reference.crop({
    origin: { column: roi.x, row: roi.y },
    width: roi.width,
    height: roi.height,
  });

  for (let imageIndex = 0; imageIndex < images.length; imageIndex++) {
    const image = images[imageIndex];
    const imageCounter =
      imageNames[imageIndex][imageNames[imageIndex].length - 1];
    const cropped = image.crop({
      origin: { column: roi.x - margin, row: roi.y - margin },
      width: roi.width + 2 * margin,
      height: roi.height + 2 * margin,
    });

    const result = getAffineTransform(cropped, croppedRef, {
      debug: true,
      debugImagePath:
        __dirname +
        '/results/debug' +
        imageCounter +
        '_roi' +
        roiCounter +
        '.png',
      maxRansacNbIterations: 1000,
      crosscheck: false,
      destinationOrigin: { row: margin, column: margin },
      enhanceContrast: true,
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

// draw rois as rectangles on images
const allImages = [reference, ...images];
const allImagesNames = ['reference', ...imageNames];
for (let image of allImages) {
  for (let roiIndex of roiIndices) {
    image.drawRectangle({
      origin: { column: rois[roiIndex].x, row: rois[roiIndex].y },
      width: rois[roiIndex].width,
      height: rois[roiIndex].height,
      strokeColor: [255, 0, 0, 255],
      out: image,
    });
  }
  writeSync(__dirname + '/results/' + allImagesNames.shift() + '.png', image);
}
