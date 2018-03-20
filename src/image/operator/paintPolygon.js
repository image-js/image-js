
function deleteDouble(points) {
  let finalPoints = [];
  for (let i = 0; i < points.length; i++) {
    if (points[i][0] === points[(i + 1) % points.length][0] && points[i][1] === points[(i + 1) % points.length][1]) {
      continue;
    } else if (points[i][0] === points[(i - 1 + points.length) % points.length][0] && points[i][1] === points[(i - 1 + points.length) % points.length][1]) {
      continue;
    } else if (points[(i + 1) % points.length][0] === points[(i - 1 + points.length) % points.length][0] && points[(i - 1 + points.length) % points.length][1] === points[(i + 1) % points.length][1]) {
      continue; // we don't consider this point only
    } else {
      finalPoints.push(points[i]);
    }
  }
  return finalPoints;
}

function lineBetweenTwoPoints(p1, p2) {
  if (p1[0] === p2[0]) {
    return { a: 0, b: p1[0], vertical: true }; // we store the x of the vertical line into b
  } else {
    const coeffA = (p2[1] - p1[1]) / (p2[0] - p1[0]);
    const coeffB = p1[1] - coeffA * p1[0];
    return { a: coeffA, b: coeffB, vertical: false };
  }
}

function isAtTheRightOfTheLine(x, y, line, height) {
  if (line.vertical === true) {
    return (line.b <= x);
  } else {
    if (line.a === 0) {
      return false;
    } else {
      const xline = (y - line.b) / line.a;
      return (xline < x && xline >= 0 && xline <= height);
    }
  }
}

/**
 * Paint a polygon defined by an array of points.
 * @memberof Image
 * @instance
 * @param {Array<Array<number>>} points - Array of [x,y] points
 * @param {object} [options]
 * @param {Array<number>} [options.color=[max,0,0]] - Array of 3 elements (R, G, B), default is red.
 * @param {Array<number>} [options.filled=false] - If you want the polygon to be filled or not.
 * @return {this} The original painted image
 */
export default function paintPolygon(points, options = {}) {
  let {
    color = [this.maxValue, 0, 0],
    filled = false
  } = options;

  this.checkProcessable('paintPoints', {
    bitDepth: [8, 16]
  });

  options.closed = true;

  let filteredPoints = deleteDouble(points);
  if (filled === false) {
    return this.paintPolyline(points, options);
  } else {
    let matrixBinary = Array(this.height);
    for (let i = 0; i < this.height; i++) {
      matrixBinary[i] = [];
      for (let j = 0; j < this.width; j++) {
        matrixBinary[i].push(0);
      }
    }
    for (let p = 0; p < filteredPoints.length; p++) {
      const line = lineBetweenTwoPoints(filteredPoints[p], filteredPoints[(p + 1) % filteredPoints.length]);
      for (let y = 0; y < this.height; y++) {
        for (let x = 0; x < this.width; x++) {
          if (isAtTheRightOfTheLine(x, y, line, this.height)) {
            matrixBinary[y][x] = (matrixBinary[y][x] === 0) ? 1 : 0;
          }
        }
      }
    }
    for (let y = 0; y < this.height; y++) {
      for (let x = 0; x < this.width; x++) {
        if (matrixBinary[y][x] === 1) {
          let numberChannels = Math.min(this.channels, color.length);
          let position = (x + y * this.width) * this.channels;
          for (let channel = 0; channel < numberChannels; channel++) {
            this.data[position + channel] = color[channel];
          }
        }
      }
    }
    return this.paintPolyline(points, options);
  }
}
