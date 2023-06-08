import { Point, Image, ImageColorModel, Mask } from 'image-js';

/**
 * Draw source, destination and transformed points on an image.
 *
 * @param source - Source points.
 * @param destination - Destination points.
 * @param result - Transformed points.
 * @param imageSide - Dimension of the image. Should be odd integer.
 * @returns The image with the points.
 */
export function drawResult(
  source: Point[],
  destination: Point[],
  result: Point[],
  imageSide = 21,
): Image {
  const center = (imageSide - 1) / 2;
  const image = new Image(imageSide, imageSide, {
    colorModel: ImageColorModel.RGB,
  });

  // draw coordinates axes
  image.drawLine(
    { row: center, column: 0 },
    { row: center, column: imageSide },
    { out: image, strokeColor: [255, 255, 255] },
  );
  image.drawLine(
    { row: 0, column: center },
    { row: imageSide, column: center },
    { out: image, strokeColor: [255, 255, 255] },
  );

  // draw points: source (green), destination (blue), result (red)
  drawBlendedPoints(source, [null, 255, null]);
  drawBlendedPoints(destination, [null, null, 255]);
  drawBlendedPoints(result, [255, null, null]);

  return image;

  function drawBlendedPoints(points: Point[], color: (number | null)[]) {
    const mask = new Mask(imageSide, imageSide);
    const withPoints = mask.drawPoints(points, {
      color: [1],
      origin: { row: center, column: center },
    });
    image.paintMask(withPoints, {
      out: image,
      color,
      blend: false,
    });
  }
}
