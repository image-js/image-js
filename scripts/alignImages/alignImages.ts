import { writeSync } from '../../src/save/write.js';
import { overlapImages } from '../../src/featureMatching/visualize/overlapImages.js';
import { readSync } from '../../src/load/read.js';
import { readFileSync, readdirSync, unlinkSync } from 'fs';
import { join } from 'path';
import { getAffineTransform } from '../../src/index.js';

// global variables
const emptyFolder = true; // results
const imageFolder = 'images/dataset2'; // folder containing images and rois

const margin = 40; // number of pixels to add around the reference ROI

const imageNames = ['img1'];
const roiIndices = [0];

// empy results folder
if (emptyFolder) {
  const path = join(__dirname, 'results');
  for (const file of readdirSync(path)) {
    unlinkSync(join(path, file));
  }
}

// load ROIs
const rawRois = readFileSync(
  join(__dirname, imageFolder, '/rois.json'),
  'utf-8',
);
const rois = JSON.parse(rawRois);

// load images
const reference = readSync(join(__dirname, imageFolder, '/reference.png'));
const images = imageNames.map((name) =>
  readSync(join(__dirname, imageFolder, name + '.png')),
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
      crosscheck: true,
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
