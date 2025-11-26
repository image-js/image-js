export interface TiffImageMetadata {
  tiff: {
    fields: Map<number, unknown>;
    tags: Record<string, unknown>;
  };
  exif: Record<string, unknown>;
  resolution?: Resolution;
}

export interface PngImageMetadata {
  resolution?: Resolution;
}

export type Resolution =
  | { x: number; y: number; unit: null }
  | { x: number; y: number; unit: 'meter' }
  | {
      x: number;
      y: number;
      unit: 'meter';
      originalValues: { x: number; y: number; unit: Exclude<Unit, 'meter'> };
    };

type Unit = 'inch' | 'centimeter' | 'meter';
