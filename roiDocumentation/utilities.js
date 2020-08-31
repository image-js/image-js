import { colors } from './colors';

export function addPolygon(svgCreator, array, options) {
  let points = array.map(
    (point) =>
      point[0] * (options.pixelSize + options.pixelSpace) +
      ',' +
      point[1] * (options.pixelSize + options.pixelSpace),
  );
  svgCreator.add('polygon', {
    points: points.join(' '),
    style: {
      stroke: colors[0],
      strokeWidth: options.pixelSpace,
      fill: 'none',
    },
  });
}

export function addCircles(svgCreator, circles, options) {
  for (let circle of circles) {
    let style = {};
    if (circle.value) {
      style = circle.style || {};
      circle = circle.value;
    }
    svgCreator.add('circle', {
      cx: options.width / 2,
      cy: options.height / 2,
      r: (circle / 2) * (options.pixelSize + options.pixelSpace),
      style: {
        stroke: 'blue',
        strokeWidth: options.pixelSpace,
        fill: 'none',
        ...style,
      },
    });
  }
}

export function addLines(svgCreator, lines, options) {
  for (let line of lines) {
    let style = {};
    if (line.value) {
      style = line.style || {};
      line = line.value;
    }
    svgCreator.add('line', {
      x1: line[0][0] * (options.pixelSize + options.pixelSpace),
      y1: line[0][1] * (options.pixelSize + options.pixelSpace),
      x2: line[1][0] * (options.pixelSize + options.pixelSpace),
      y2: line[1][1] * (options.pixelSize + options.pixelSpace),
      style: {
        stroke: colors[0],
        strokeWidth: options.pixelSpace * 2,
        ...style,
      },
    });
  }
}

export function addTitle(svgCreator, title, options) {
  svgCreator.addText(title, {
    x: options.width / 2,
    y: options.pixelSize / 2 + 5,
    style: {
      dominantBaseline: 'middle',
      textAnchor: 'middle',
      fill: 'darkred',
      fontWeight: 'bold',
      fontSize: 16,
    },
  });
}

export function addTextLines(svgCreator, imageOptions, options) {
  const textLines = imageOptions.textLines;
  for (let i = 0; i < textLines.length; i++) {
    let textLine = textLines[i];
    let style = {};
    if (textLine.value) {
      style = textLine.style;
      textLine = textLine.value;
    }
    svgCreator.addText(textLine, {
      x: imageOptions.leftTextMargin,
      y: options.height - (textLines.length - i) * 20,
      style: {
        dominantBaseline: 'top',
        textAnchor: 'left',
        fill: colors[1],
        fontWeight: 'bold',
        fontSize: 14,
        ...style,
      },
    });
  }
}

export function addPixels(svgCreator, pixels, options) {
  for (let x = 0; x < pixels[0].length; x++) {
    for (let y = 0; y < pixels.length; y++) {
      addPixel(svgCreator, pixels, x, y, options);
    }
  }
}

function addPixel(svgCreator, pixels, x, y, options) {
  svgCreator.add('rect', {
    x: x * (options.pixelSize + options.pixelSpace) + options.pixelSpace / 2,
    y: y * (options.pixelSize + options.pixelSpace) + options.pixelSpace / 2,
    width: options.pixelSize,
    height: options.pixelSize,
    style: {
      strokeWidth: 0,
      stroke: 'white',
      fill: options.pixelColors[pixels[y][x] % options.pixelColors.length],
    },
  });
}
