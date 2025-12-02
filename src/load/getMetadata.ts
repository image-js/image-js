import type { decode } from 'tiff';

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
  };
}
