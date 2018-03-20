// REFERENCES :
// https://stackoverflow.com/questions/38285229/calculating-aspect-ratio-of-perspective-transform-destination-image/38402378#38402378
// http://www.corrmap.com/features/homography_transformation.php
// https://ags.cs.uni-kl.de/fileadmin/inf_ags/3dcv-ws11-12/3DCV_WS11-12_lec04.pdf
// http://graphics.cs.cmu.edu/courses/15-463/2011_fall/Lectures/morphing.pdf

import { Matrix, inverse, SingularValueDecomposition } from 'ml-matrix';

import Image from '../Image';

function order4Points(pts) {
  let tl = 0;
  let tr = 0;
  let br = 0;
  let bl = 0;

  let minX = pts[0][0];
  let indexMinX = 0;

  for (let i = 1; i < pts.length; i++) {
    if (pts[i][0] < minX) {
      minX = pts[i][0];
      indexMinX = i;
    }
  }

  let minX2 = pts[(indexMinX + 1) % pts.length][0];
  let indexMinX2 = (indexMinX + 1) % pts.length;

  for (let i = 1; i < pts.length; i++) {
    if (pts[i][0] < minX2 && i !== indexMinX) {
      minX2 = pts[i][0];
      indexMinX2 = i;
    }
  }

  if (pts[indexMinX2][1] < pts[indexMinX][1]) {
    tl = pts[indexMinX2];
    bl = pts[indexMinX];
    if (indexMinX !== ((indexMinX2 + 1) % 4)) {
      tr = pts[(indexMinX2 + 1) % 4];
      br = pts[(indexMinX2 + 2) % 4];
    } else {
      tr = pts[(indexMinX2 + 2) % 4];
      br = pts[(indexMinX2 + 3) % 4];
    }
  } else {
    bl = pts[indexMinX2];
    tl = pts[indexMinX];
    if (indexMinX2 !== ((indexMinX + 1) % 4)) {
      tr = pts[(indexMinX + 1) % 4];
      br = pts[(indexMinX + 2) % 4];
    } else {
      tr = pts[(indexMinX + 2) % 4];
      br = pts[(indexMinX + 3) % 4];
    }
  }

  return [tl, tr, br, bl];
}

function distance2Points(p1, p2) {
  return Math.sqrt(Math.pow(p1[0] - p2[0], 2) + Math.pow(p1[1] - p2[1], 2));
}

function crossVect(u, v) {
  let result = [u[1] * v[2] - u[2] * v[1], u[2] * v[0] - u[0] * v[2], u[0] * v[1] - u[1] * v[0]];
  return result;
}

function dotVect(u, v) {
  let result = u[0] * v[0] + u[1] * v[1] + u[2] * v[2];
  return result;
}


function computeWidthAndHeigth(tl, tr, br, bl, widthImage, heightImage) {
  let w = Math.max(distance2Points(tl, tr), distance2Points(bl, br));
  let h = Math.max(distance2Points(tl, bl), distance2Points(tr, br));
  let finalW = 0;
  let finalH = 0;
  let u0 = Math.ceil(widthImage / 2);
  let v0 = Math.ceil(heightImage / 2);
  let arVis = w / h;

  let m1 = [tl[0], tl[1], 1];
  let m2 = [tr[0], tr[1], 1];
  let m3 = [bl[0], bl[1], 1];
  let m4 = [br[0], br[1], 1];

  let k2 = dotVect(crossVect(m1, m4), m3) / dotVect(crossVect(m2, m4), m3);
  let k3 = dotVect(crossVect(m1, m4), m2) / dotVect(crossVect(m3, m4), m2);

  let n2 = [k2 * m2[0] - m1[0], k2 * m2[1] - m1[1], k2 * m2[2] - m1[2]];
  let n3 = [k3 * m3[0] - m1[0], k3 * m3[1] - m1[1], k3 * m3[2] - m1[2]];


  let n21 = n2[0];
  let n22 = n2[1];
  let n23 = n2[2];

  let n31 = n3[0];
  let n32 = n3[1];
  let n33 = n3[2];


  let f = (1.0 / (n23 * n33)) * ((n21 * n31 - (n21 * n33 + n23 * n31) * u0 + n23 * n33 * u0 * u0) + (n22 * n32 - (n22 * n33 + n23 * n32) * v0 + n23 * n33 * v0 * v0));
  if (f >= 0) {
    f = Math.sqrt(f);
  } else {
    f = Math.sqrt(-f);
  }

  let A = new Matrix([[f, 0, u0], [0, f, v0], [0, 0, 1]]);
  let At = A.transpose();
  let Ati = inverse(At);
  let Ai = inverse(A);

  let n2R = Matrix.rowVector(n2);
  let n3R = Matrix.rowVector(n3);

  let arReal = Math.sqrt(dotVect(n2R.mmul(Ati).mmul(Ai).to1DArray(), n2) / dotVect(n3R.mmul(Ati).mmul(Ai).to1DArray(), n3));


  if (arReal === 0 || arVis === 0) {
    finalW = Math.ceil(w);
    finalH = Math.ceil(h);
  } else if (arReal < arVis) {
    finalW = Math.ceil(w);
    finalH = Math.ceil(finalW / arReal);
  } else {
    finalH = Math.ceil(h);
    finalW = Math.ceil(arReal * finalH);
  }
  return [finalW, finalH];
}


function projectionPoint(x, y, a, b, c, d, e, f, g, h, image, channel)  {
  let [newX, newY] = [(a * x + b * y + c) / (g * x + h * y + 1), (d * x + e * y + f) / (g * x + h * y + 1)];
  return image.getValueXY(Math.floor(newX), Math.floor(newY), channel);
}

/**
 * Transform a quadrilateral into a rectangle
 * @memberof Image
 * @instance
 * @param {Array<Array<number>>} [pts] - Array of the four corners.
 * @param {object} [options]
 * @param {boolean} [options.calculateRatio=true] - true if you want to calculate the aspect ratio "width x height" by taking the perspectiv into consideration.
 * @return {Image} The new image, which is a rectangle
 * @example
 * var cropped = image.warpingFourPoints({
 *   pts: [[0,0], [100, 0], [80, 50], [10, 50]]
 * });
 */

export default function warpingFourPoints(pts, options = {}) {
  let {
    calculateRatio = true
  } = options;

  if (pts.length !== 4) {
    throw new Error(`The array pts must have four elements, which are the four corners. Currently, pts have ${pts.length} elements`);
  }

  let [pt1, pt2, pt3, pt4] = pts;

  let quadrilaterial = [pt1, pt2, pt3, pt4];
  let [tl, tr, br, bl] = order4Points(quadrilaterial);
  let widthRect;
  let heightRect;
  if (calculateRatio) {
    [widthRect, heightRect] = computeWidthAndHeigth(tl, tr, br, bl, this.width, this.height);
  } else {
    widthRect = Math.ceil(Math.max(distance2Points(tl, tr), distance2Points(bl, br)));
    heightRect = Math.ceil(Math.max(distance2Points(tl, bl), distance2Points(tr, br)));
  }
  let newImage = Image.createFrom(this, { width: widthRect, height: heightRect });

  let [X1, Y1] = tl;
  let [X2, Y2] = tr;
  let [X3, Y3] = br;
  let [X4, Y4] = bl;
  let [x1, y1] = [0, 0];
  let [x2, y2] = [0, widthRect - 1];
  let [x3, y3] = [heightRect - 1, widthRect - 1];
  let [x4, y4] = [heightRect - 1, 0];

  let S = new Matrix([
    [x1, y1, 1, 0, 0, 0, -x1 * X1, -y1 * X1],
    [x2, y2, 1, 0, 0, 0, -x2 * X2, -y2 * X2],
    [x3, y3, 1, 0, 0, 0, -x3 * X3, -y1 * X3],
    [x4, y4, 1, 0, 0, 0, -x4 * X4, -y4 * X4],
    [0, 0, 0, x1, y1, 1, -x1 * Y1, -y1 * Y1],
    [0, 0, 0, x2, y2, 1, -x2 * Y2, -y2 * Y2],
    [0, 0, 0, x3, y3, 1, -x3 * Y3, -y3 * Y3],
    [0, 0, 0, x4, y4, 1, -x4 * Y4, -y4 * Y4]
  ]);

  let D = Matrix.columnVector([X1, X2, X3, X4, Y1, Y2, Y3, Y4]);

  let svd = new SingularValueDecomposition(S);
  let T = svd.solve(D); // solve S*T = D
  let [a, b, c, d, e, f, g, h] = T.to1DArray();

  let Xt = new Matrix(heightRect, widthRect);

  for (let channel = 0; channel < this.channels; channel++) {
    for (let i = 0; i < heightRect; i++) {
      for (let j = 0; j < widthRect; j++) {
        Xt.set(i, j, projectionPoint(i, j, a, b, c, d, e, f, g, h, this, channel));
      }
    }
    newImage.setMatrix(Xt, { channel: channel });
  }

  return newImage;
}
