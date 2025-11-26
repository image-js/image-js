import type { decode } from 'tiff';

import type { Resolution } from './load.types.ts';

type TiffIfd = ReturnType<typeof decode>[number];

/**
 * Get metadata from an IFD.
 * @param ifd - The IFD.
 * @returns The metadata.
 */
export function getMetadata(ifd: TiffIfd) {
  return {
    tiff: {
      fields: ifd.fields,
      tags: ifd.map,
    },
    exif: ifd.exif as unknown as Record<string, unknown>,
    resolution: getTiffResolution(ifd),
  };
}
/**
 * Gets image resolution from its metadata and converts it into Pixels per meter, when it's possible. Also keeps original resolution values and units.
 * @param ifd - Tiff metadata.
 * @returns Resolution object.
 */
function getTiffResolution(ifd: TiffIfd): Resolution | undefined {
  const inchesPerMeter = 39.3700787402;
  const centimetersPerMeter = 100;
  if (!ifd.xResolution || !ifd.yResolution) {
    return undefined;
  }

  switch (ifd.resolutionUnit) {
    case 1:
      return { x: ifd.xResolution, y: ifd.yResolution, unit: null };
    case 3:
      return {
        x: ifd.xResolution / centimetersPerMeter,
        y: ifd.yResolution / centimetersPerMeter,
        unit: 'meter',
        originalValues: {
          x: ifd.xResolution,
          y: ifd.yResolution,
          unit: 'centimeter',
        },
      };
    default:
      return {
        x: ifd.xResolution / inchesPerMeter,
        y: ifd.yResolution / inchesPerMeter,
        unit: 'meter',
        originalValues: {
          x: ifd.xResolution,
          y: ifd.yResolution,
          unit: 'inch',
        },
      };
  }
}
