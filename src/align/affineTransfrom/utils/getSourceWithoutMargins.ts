import { Image, Point } from '../../..';

/**
 * Crop source image for contrast enhancement.
 * @param source - Source image enlarged compared to the destination image.
 * @param destination - Destination image.
 * @param destinationOrigin - Estimated origin of the destination image in the source image (relative to top-left corner).
 * @returns The source image without margins.
 */
export function getSourceWitoutMargins(
  source: Image,
  destination: Image,
  destinationOrigin: Point,
): Image {
  const width = Math.min(
    destination.width,
    source.width - destinationOrigin.column,
  );
  const height = Math.min(
    destination.height,
    source.height - destinationOrigin.row,
  );

  return source.crop({
    origin: { row: destinationOrigin.row, column: destinationOrigin.column },
    width,
    height,
  });
}
