import { SVGCreator } from './SVGCreator';
import { writeFileSync, fstat } from 'fs';
import { join } from 'path';

import { getImagesOptions } from './imagesOptions';
import {
  addCircles,
  addPixels,
  addLines,
  addPolygon,
  addTextLines,
  addTitle,
} from './utilities';

let options = {
  pixelSize: 40,
  pixelSpace: 4,
  pixelColors: ['#EEE', '#555', 'darkgreen'],
};

const imagesOptions = getImagesOptions();

let readme = '';

for (let key in imagesOptions) {
  createImage(key, imagesOptions[key]);
  readme += '<img src="' + key + '.svg">\n';
}

writeFileSync(join(__dirname, 'index.html'), readme, 'utf8');

function createImage(key, imageOptions) {
  let nbPointsX = imageOptions.pixels[0].length;
  let nbPointsY = imageOptions.pixels.length;

  options.width =
    nbPointsX * (options.pixelSize + options.pixelSpace) + options.pixelSpace;
  options.height =
    nbPointsY * (options.pixelSize + options.pixelSpace) + options.pixelSpace;

  const svgCreator = new SVGCreator(options.width, options.height);

  addPixels(svgCreator, imageOptions.pixels, options);
  addPolygon(svgCreator, imageOptions.polygon, options);
  addLines(svgCreator, imageOptions.lines, options);
  addCircles(svgCreator, imageOptions.circles, options);
  addTitle(svgCreator, imageOptions.title, options);
  addTextLines(svgCreator, imageOptions, options);
  writeFileSync(
    join(__dirname, key + '.svg'),
    svgCreator.toSVG().replace(/>/g, '>\n'),
    'utf8',
  );
}
