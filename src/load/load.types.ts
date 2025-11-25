export interface TiffImageMetadata {
  tiff: {
    fields: Map<number, unknown>;
    tags: Record<string, unknown>;
  };
  exif: Record<string, unknown>;
}

export interface PngImageMetadata {
  resolution: Resolution;
}

export type Resolution =
  | { x: number; y: number; unit: null }
  | { x: number; y: number }
  | {
      x: number;
      y: number;
      originalValues: { x: number; y: number; unit: Unit };
    };

type Unit = 'inch' | 'centimeter';
