export interface ImageMetadata {
  tiff: {
    fields: Map<number, unknown>;
    tags: Record<string, unknown>;
  };
  exif: Record<string, unknown>;
}

export interface Resolution {
  x: number;
  y: number;
  unit: ResolutionUnit;
}

export type ResolutionUnit = 'inch' | 'centimeter' | 'meter' | 'unknown';
